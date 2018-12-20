import CustomizableScene from "./customizableScene"
import { Engine, MeshAssetTask, Vector3, ArcFollowCamera, ArcRotateCamera, ActionManager, MeshBuilder, PhysicsImpostor } from "babylonjs"
import Car from "./car";

export default class CarScene extends CustomizableScene {
    constructor(name: string, engine: Engine) {
        super(name, engine);
    }

    protected onLevelLoaded() : void
    {
        this.m_car.initializePhysics(this);
    }

    protected initialize() {

        this.m_camera = new ArcRotateCamera("CarCamera", 3 * Math.PI / 2, Math.PI / 8, 50, Vector3.Zero(), this);
        this.m_camera.attachControl(this.getEngine().getRenderingCanvas() as HTMLCanvasElement, true);

        var sphere = MeshBuilder.CreateSphere("sphere", {segments:16, diameter: 10},this);
        sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor,{mass: 3}, this);
        sphere.position = new Vector3(0,100,0);


        this.loadMesh("redbullCar", "assets/Redbull/", "Car.obj",
            (task: MeshAssetTask) => {

                this.m_car = new Car(task.loadedMeshes, "RedbullCar", this);
            });
        var myGround = BABYLON.MeshBuilder.CreateGround("myGround", { width: 100, height: 100, subdivisions: 4 }, this);

        myGround.physicsImpostor = new BABYLON.PhysicsImpostor(myGround, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });

        this.actionManager = new ActionManager(this);
    }

    protected update(): void {
        if (this.m_camera !== undefined && this.m_car !== undefined) {
            (this.m_camera as ArcRotateCamera).target = this.m_car.transform.position;
            this.m_car.transform.position.x += this.dt;
        }
    }

    private m_car!: Car;
}