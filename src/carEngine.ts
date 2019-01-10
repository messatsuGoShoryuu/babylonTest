
import { setFlag, removeFlag, isFlagSet } from "./bitwise"
import { lerp, clamp, sign } from "./math"

const ENGINE_IS_ACCELERATING_FLAG: number = 0x01;
const ENGINE_IS_BREAKING_FLAG: number = 0x02;
const ENGINE_IS_STEERING_LEFT_FLAG: number = 0x04;
const ENGINE_IS_STEERING_RIGHT_FLAG: number = 0x08;
const ENGINE_STEER_OVERWRITTEN: number = 0x10;
const ENGINE_DRAG_ON_IDLE = 20.0;

export default class CarEngine {

    constructor(maxSpeed: number, engineForce: number, brakeForce: number, maxSteeringAngle: number) {
        this.m_maxSpeed = maxSpeed;
        this.m_brakeForce = brakeForce;
        this.m_engineForce = engineForce;
        this.m_maxSteeringAngle = maxSteeringAngle;
        this.m_flags = 0;
        this.m_acceleration = 0.0;
        this.m_accelerationDrag = (this.m_engineForce * (1.0 / (this.m_maxSpeed * this.m_maxSpeed)));
        this.m_steeringAngle = 0.0;
        this.m_speed = 0.0;
    }

    accelerate(value: boolean) {
        if (value) {
            this.m_flags = setFlag(this.m_flags, ENGINE_IS_ACCELERATING_FLAG);
        }
        else {
            this.m_flags = removeFlag(this.m_flags, ENGINE_IS_ACCELERATING_FLAG);
        }
    }

    brake(value: boolean) {
        if (value) {
            this.m_flags = setFlag(this.m_flags, ENGINE_IS_BREAKING_FLAG);
        }

        else {
            this.m_flags = removeFlag(this.m_flags, ENGINE_IS_BREAKING_FLAG);
        }
    }

    steer(direction: number): void {
        this.m_flags = removeFlag(this.m_flags, ENGINE_IS_STEERING_LEFT_FLAG | ENGINE_IS_STEERING_RIGHT_FLAG);

        if (direction === -1) {
            this.m_flags = setFlag(this.m_flags, ENGINE_IS_STEERING_LEFT_FLAG);
        }
        else if (direction === 1) {
            this.m_flags = setFlag(this.m_flags, ENGINE_IS_STEERING_RIGHT_FLAG);
        }
    }

    public update(dt: number): void {
        if (!this.isAccelerating && !this.isBraking) {
            this.m_acceleration = 0.0;
            if (this.m_speed > 0.0) {
                this.m_speed -= ENGINE_DRAG_ON_IDLE * dt;
                if (this.m_speed < 0.0) this.m_speed = 0.0;
            }
            else if (this.m_speed < 0.0) {
                this.m_speed += ENGINE_DRAG_ON_IDLE * dt;
                if (this.m_speed > 0.0) this.m_speed = 0.0;
            }
        }
        if (this.isAccelerating) {
            this.applyAccelerationPhysics(dt);
        }
        else if (this.isBraking) {
            this.applyBrakingPhysics(dt);
        }
        else if (!this.isAccelerating) this.m_acceleration = 0.0;

        this.applySteeringPhysics(dt);
        this.m_speed += this.m_acceleration * dt;
    }

    private applyAccelerationPhysics(dt: number): void {
        this.m_acceleration = this.m_engineForce - this.calculateAccelerationDrag();
        if (this.m_acceleration < 0.0) this.m_acceleration = 0.0;
        if (this.m_speed > this.m_maxSpeed) {
            this.m_speed = this.m_maxSpeed;
        }
    }

    private applyBrakingPhysics(dt: number): void {
        this.m_acceleration = -this.m_engineForce * 1.5 + this.calculateAccelerationDrag();
        if (this.m_acceleration > 0.0) this.m_acceleration = 0.0;
        if (this.m_speed < 0.0) this.m_acceleration = -10;
        if (this.m_speed < -this.m_brakeForce) {
            this.m_speed = -this.m_brakeForce;
        }
    }

    private applySteeringPhysics(dt: number): void {
        var goalSteeringWheel = this.m_maxSteeringAngle * this.steeringDirection;

        var ratio = this.m_speed / this.m_maxSpeed;
        ratio = clamp(1.0 - 0.95 * ratio, 0.1, 1.0);
        goalSteeringWheel = Math.PI / 3 * ratio * - this.steeringDirection;

        this.m_steeringAngle = lerp(this.m_steeringAngle, goalSteeringWheel, 5.0 * dt);

    }

    stopOverwriteSteer(): void {
        this.m_flags = removeFlag(this.m_flags, ENGINE_STEER_OVERWRITTEN);
    }

    overwriteSteerValue(value: number): void {
        this.m_flags = setFlag(this.m_flags, ENGINE_STEER_OVERWRITTEN);
        this.m_steeringAngle = value;
    }

    calculateAccelerationDrag(): number {
        return this.m_accelerationDrag * this.m_speed * this.m_speed;
    }

    get steeringDirection(): number {
        if (isFlagSet(this.m_flags, ENGINE_IS_STEERING_LEFT_FLAG)) return -1;
        if (isFlagSet(this.m_flags, ENGINE_IS_STEERING_RIGHT_FLAG)) return 1;
        return 0;
    }

    get steeringAngle(): number {
        return this.m_steeringAngle;
    }

    get speed(): number {
        return this.m_speed;
    }

    get acceleration(): number {
        return this.m_acceleration;
    }

    get isBraking(): boolean {
        return (this.m_flags & ENGINE_IS_BREAKING_FLAG) === ENGINE_IS_BREAKING_FLAG;
    }

    get isAccelerating(): boolean {
        return (this.m_flags & ENGINE_IS_ACCELERATING_FLAG) === ENGINE_IS_ACCELERATING_FLAG;
    }

    private m_maxSpeed: number;
    private m_speed: number;
    private m_acceleration: number;
    private m_accelerationDrag: number;
    private m_engineForce: number;
    private m_brakeForce: number;
    private m_steeringAngle: number;
    private m_maxSteeringAngle: number;
    private m_flags: number;

}