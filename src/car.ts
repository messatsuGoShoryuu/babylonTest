import { TransformNode, AbstractMesh, Scene, Vector3, ArcFollowCamera, Mesh, PhysicsImpostor, MeshBuilder, Vector2, Axis, Space, Quaternion, DirectionalLight, Debug, Engine, } from "babylonjs";

import CarEngine from "./carEngine";
import { sign, clamp, lerp, intersect } from "./math";
import EventManager from "./eventManager";

export default class Car {
    constructor(meshes: Array<AbstractMesh>, name: string, engine: CarEngine,  scene: Scene) {
        this.m_meshes = meshes;
        this.m_physicsRoot = new Mesh("PhysicsRoot", scene);
        this.m_name = name;
        this.m_meshRoot = new Mesh("MeshRoot", scene);
        this.m_velocity = new Vector3;
        this.m_imaginaryNode = new TransformNode("imaginaryNode", scene, false);
        this.m_debugPivot = MeshBuilder.CreateBox("debugPivot", { width: 1, depth: 1, height: 10 }, scene);
        this.m_turnG = 0;
        this.m_rollAngle = 0;
        this.m_pitchAngle = 0;
        this.m_engine = engine;

        this.m_meshes.forEach((m, i) => {
            {
                if (m.name === "__root__") {
                    this.m_physicsRoot.setAbsolutePosition(m.getAbsolutePosition());
                    this.m_meshRoot.setAbsolutePosition(m.getAbsolutePosition());
                }
            }
        });

        this.m_meshes.forEach((m, i) => {
            {
                if (m.name === "WheelsBack")
                    this.m_backWheels = m;
                if (m.name === "WheelFrontRightParent")
                    this.m_frontLeftWheelAxis = m;
                if (m.name === "WheelFrontRightParent_2")
                    this.m_frontRightWheelAxis = m;

                if (m.name === "CarBodyParent")
                    this.m_carBodyPitch = m;

                if (m.name === "WheelsFrontRight")
                    this.m_frontRightWheel = m;
                else if (m.name === "WheelsFrontLeft")
                    this.m_frontLeftWheel = m;
                else if (m.name === "CarBody")
                    this.m_carBodyRoll = m;
                else this.m_meshRoot.addChild(m);
            }
        })


        this.m_carBodyPitch.addChild(this.m_carBodyRoll);
        this.m_frontLeftWheelAxis.addChild(this.m_frontLeftWheel);
        this.m_frontRightWheelAxis.addChild(this.m_frontRightWheel);


        this.m_physicsRoot.addChild(this.m_meshRoot);
        this.initializePhysics(scene);

    }

    initializePhysics(scene: Scene): void {
        // Make every collider into a physics impostor
        var collider = MeshBuilder.CreateBox("collider", { width: 10, height: 11, depth: 20 }, scene);
        this.m_physicsRoot.addChild(collider);
        collider.physicsImpostor = new PhysicsImpostor(collider, PhysicsImpostor.BoxImpostor, { mass: 0.1 }, scene);

        collider.isVisible = false;

        this.m_physicsRoot.physicsImpostor = new PhysicsImpostor(this.m_physicsRoot, PhysicsImpostor.NoImpostor, { mass: 100, friction: 0 }, scene);

        if (this.m_physicsRoot.physicsImpostor) {
            this.m_physicsRoot.physicsImpostor.setLinearVelocity(scene.gravity)
        }

        this.m_lastPosition = this.m_physicsRoot.position;
    }

    accelerate(value: boolean): void {
        this.m_engine.accelerate(value);
    }

    brake(value: boolean): void {
        this.m_engine.brake(value);

    }

    steer(direction: number): void {
        this.m_engine.steer(direction);
    }

  
    private resetRotations(): void {
        this.m_frontLeftWheelAxis.rotationQuaternion = Quaternion.RotationQuaternionFromAxis(
            this.m_physicsRoot.right,
            this.m_physicsRoot.up,
            this.m_physicsRoot.forward.scale(-1.0));

        this.m_frontRightWheelAxis.rotationQuaternion = Quaternion.RotationQuaternionFromAxis(
            this.m_physicsRoot.right,
            this.m_physicsRoot.up,
            this.m_physicsRoot.forward.scale(-1.0));

        this.m_carBodyPitch.rotationQuaternion = Quaternion.Identity();
        this.m_carBodyRoll.rotationQuaternion = Quaternion.Identity();
        this.m_carBodyPitch.rotate(Axis.Z, Math.PI, Space.LOCAL);
        this.m_carBodyPitch.rotate(Axis.Y, Math.PI, Space.LOCAL);
    }

    private applyWheelAxisRotations(): void {
        this.m_frontLeftWheelAxis.rotate(this.m_frontLeftWheelAxis.up, this.m_engine.steeringAngle);

        this.m_frontRightWheelAxis.rotate(this.m_frontRightWheelAxis.up, this.m_engine.steeringAngle);
    }

    private rotateWheels(dt: number): void {
        let distance: number = this.m_physicsRoot.position.subtract(this.m_lastPosition).length() * 19.7;

        this.m_frontLeftWheel.rotate(Axis.X, dt * distance * sign(this.m_engine.speed), Space.LOCAL);
        this.m_frontRightWheel.rotate(Axis.X, dt * distance * sign(this.m_engine.speed), Space.LOCAL);
        this.m_backWheels.rotate(Axis.X, -dt * distance * sign(this.m_engine.speed), Space.LOCAL);
    }

    updatePhysics(dt: number, gravity: Vector3): void {

        this.m_engine.update(dt);
        
                    
        this.m_velocity.z = -this.m_engine.speed;
        if (this.m_velocity.y < -18) this.m_velocity.y = -18;

        if (this.m_physicsRoot.physicsImpostor)
            this.m_physicsRoot.physicsImpostor.setLinearVelocity(this.m_physicsRoot.forward.scale(this.m_velocity.z).add(new Vector3(0, this.m_velocity.y, 0)));

        this.rotateWheels(dt);

        this.resetRotations();

        this.applyWheelAxisRotations();
        this.applySteeringPhysics(dt);
        this.applyAccelerationMomentum(dt);

        this.m_lastPosition = this.m_physicsRoot.position;

        EventManager.dispatch("GuiSpeedDisplay", new String("Speed = " + this.m_engine.speed +
        "\nAcceleration = " + this.m_engine.acceleration));
    }

    private applyAccelerationMomentum(dt: number) {
        if (this.m_engine.acceleration === 0.0) {
            this.m_pitchAngle = lerp(this.m_pitchAngle, 0.0, 7.0 * dt);

            this.m_carBodyPitch.rotate(Axis.X, this.m_pitchAngle, Space.LOCAL);
            return;
        }
        var ratio = this.m_engine.acceleration / this.m_engine.speed;

        ratio = clamp(ratio * Math.PI * 0.05, -Math.PI / 30, Math.PI / 30);
        this.m_pitchAngle = lerp(this.m_pitchAngle, ratio, 5.0 * dt);

        this.m_carBodyPitch.rotate(Axis.X, this.m_pitchAngle, Space.LOCAL);
    }

    private applySteeringPhysics(dt: number): boolean {        

        var direction = sign(Vector3.Dot(this.m_physicsRoot.forward, this.m_frontLeftWheel.right));

        var pivot = this.findImaginaryPivot(direction);


        if (isNaN(pivot.x)) {
            this.m_rollAngle = lerp(this.m_rollAngle, 0.0, 10.0 * dt);
            this.m_carBodyRoll.rotate(Axis.Z, this.m_rollAngle, Space.LOCAL);
            return false;
        }
        var r: number = this.m_backWheels.getAbsolutePosition().subtract(pivot).length() * 3.0;

        this.m_debugPivot.position = pivot;

        this.m_imaginaryNode.setAbsolutePosition(this.m_physicsRoot.getAbsolutePosition().clone());

        if (!this.m_imaginaryNode.rotationQuaternion)
            this.m_imaginaryNode.rotationQuaternion = Quaternion.Identity();
        if (this.m_imaginaryNode.rotationQuaternion && this.m_physicsRoot.rotationQuaternion)
            this.m_imaginaryNode.rotationQuaternion = Quaternion.RotationQuaternionFromAxis(this.m_physicsRoot.right, this.m_physicsRoot.up, this.m_physicsRoot.forward);


        var dtVel = this.m_velocity.z * dt;
        var alpha = (dtVel) / r * direction;

        this.m_imaginaryNode.rotateAround(pivot, this.m_physicsRoot.up, alpha);

        this.m_physicsRoot.rotationQuaternion = Quaternion.RotationQuaternionFromAxis(this.m_imaginaryNode.right, this.m_imaginaryNode.up, this.m_imaginaryNode.forward);

        this.rollFromG(direction, dt, r);

        return true;
    }

    private rollFromG(direction: number, dt: number, r: number, overWriteTurnG: number = this.m_turnG): void {
        if (dt >= 1.0) return;

        this.m_turnG = overWriteTurnG;

        this.m_turnG = (this.m_velocity.z * this.m_velocity.z) / r * direction * dt * 0.03;
        console.log(this.m_turnG);
        this.m_turnG = clamp(this.m_turnG, -Math.PI / 20.0, Math.PI / 20.0);


        this.m_rollAngle = lerp(this.m_rollAngle, this.m_turnG, 5.0 * dt);

        this.m_carBodyRoll.rotate(Axis.Z, this.m_rollAngle, Space.LOCAL);
    }



    private findImaginaryPivot(direction: number): Vector3 {
        let backOrigin = this.m_backWheels.getAbsolutePosition();
        let backTip = backOrigin.add(this.m_backWheels.right.normalizeToNew());

        let frontOrigin = direction === 1 ? this.m_frontLeftWheel.getAbsolutePosition() : this.m_frontRightWheel.getAbsolutePosition();

        let frontTip = frontOrigin.add(direction === 1 ? this.m_frontLeftWheel.right.normalizeToNew() :
            this.m_frontRightWheel.right.normalizeToNew());

        return intersect(frontOrigin, frontTip, backOrigin, backTip);
    }

    get transform(): AbstractMesh {
        return this.m_physicsRoot;
    }

    private m_name: string;
    private m_meshes: Array<AbstractMesh>;
    private m_meshRoot: Mesh;
    private m_frontLeftWheel!: AbstractMesh;
    private m_frontRightWheel!: AbstractMesh;
    private m_frontLeftWheelAxis!: AbstractMesh;
    private m_frontRightWheelAxis!: AbstractMesh;
    private m_carBodyRoll!: AbstractMesh;
    private m_carBodyPitch!: AbstractMesh;
    private m_backWheels!: AbstractMesh;
    private m_physicsRoot: Mesh;
    private m_velocity: Vector3;
    private m_lastPosition!: Vector3;
    private m_imaginaryNode: TransformNode;
    private m_debugPivot: Mesh;
    private m_turnG: number;
    private m_rollAngle: number;
    private m_pitchAngle: number;
    private m_engine: CarEngine;

}
