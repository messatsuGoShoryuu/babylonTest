export default class CarEngine {
    constructor(maxSpeed: number, engineForce: number, brakeForce: number, maxSteeringAngle: number);
    accelerate(value: boolean): void;
    brake(value: boolean): void;
    steer(direction: number): void;
    update(dt: number): void;
    private applyAccelerationPhysics;
    private applyBrakingPhysics;
    private applySteeringPhysics;
    stopOverwriteSteer(): void;
    overwriteSteerValue(value: number): void;
    calculateAccelerationDrag(): number;
    readonly steeringDirection: number;
    readonly steeringAngle: number;
    readonly speed: number;
    readonly acceleration: number;
    readonly isBraking: boolean;
    readonly isAccelerating: boolean;
    private m_maxSpeed;
    private m_speed;
    private m_acceleration;
    private m_accelerationDrag;
    private m_engineForce;
    private m_brakeForce;
    private m_steeringAngle;
    private m_maxSteeringAngle;
    private m_flags;
}
