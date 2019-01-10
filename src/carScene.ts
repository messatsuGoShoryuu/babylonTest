import CustomizableScene from "./customizableScene"
import { Engine, MeshAssetTask, Vector3, ArcFollowCamera, ArcRotateCamera, ActionManager, MeshBuilder, PhysicsImpostor, StandardMaterial, Texture, ExecuteCodeAction, Action, ActionEvent, FollowCamera } from "babylonjs"
import Car from "./car";
import CarEngine from "./carEngine"
import CarGUI from "./gui" 

export default class CarScene extends CustomizableScene {
    constructor(name: string, engine: Engine) {
        super(name, engine);
        this.m_gui = new CarGUI();
    }

    protected onLevelLoaded(): void {
        this.m_car.transform.position.y = 10;
    }

    protected isKeyPressed(query: string, event: ActionEvent): boolean {
        return (event.sourceEvent.key == query
            && event.sourceEvent.type == "keydown");
    }

    protected isKeyReleased(query: string, event: ActionEvent): boolean {
        return (event.sourceEvent.key == query
            && event.sourceEvent.type == "keyup");
    }

    protected initializeControls() {
        this.actionManager = new ActionManager(this);
        this.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
            if (this.isKeyPressed("ArrowUp", event)) {
                this.m_car.accelerate(true);
            }

            if (this.isKeyPressed("ArrowDown", event))
                this.m_car.brake(true);

            if (this.isKeyPressed("ArrowLeft", event)) {
                this.m_car.steer(-1.0);
                this.m_steerLeft = true;
            }

            if (this.isKeyPressed("ArrowRight", event)) {
                this.m_car.steer(1.0);
                this.m_steerRight = true;
            }
        }));

        this.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
            if (this.isKeyReleased("ArrowUp", event)) {
                this.m_car.accelerate(false);
            }

            if (this.isKeyReleased("ArrowDown", event))
                this.m_car.brake(false);

            if (this.isKeyReleased("ArrowLeft", event)) {
                this.m_steerLeft = false;
                if(!this.m_steerRight) this.m_car.steer(0);
            }

            if (this.isKeyReleased("ArrowRight", event)) {
                this.m_steerRight = false;
                if(!this.m_steerLeft) this.m_car.steer(0);
            }
        }));
    }

    protected initialize() {
        var me = this;


     //   me.loadMesh("redbullCar", "assets/Redbull/", "Car.obj",
        me.loadMesh("redbullCar", "assets/", "RaceCar.glb",
            (task: MeshAssetTask) => {

                let engine: CarEngine = new CarEngine(550.0, 150.0, 200.0, Math.PI/3);

                me.m_car = new Car(task.loadedMeshes, "RedbullCar", engine, me);
                this.m_camera = new ArcFollowCamera("CarCamera", Math.PI / 2, Math.PI / 8, 2, me.m_car.transform, this);
                this.m_camera.attachControl(this.getEngine().getRenderingCanvas() as HTMLCanvasElement, true);
                (this.m_camera as ArcRotateCamera).keysDown = [];
                (this.m_camera as ArcRotateCamera).keysUp = [];
                (this.m_camera as ArcRotateCamera).keysLeft = [];
                (this.m_camera as ArcRotateCamera).keysRight = [];
            });

        var myGround = BABYLON.MeshBuilder.CreateGround("myGround", { width: 100000, height: 100000, subdivisions: 64}, this);

        let material: StandardMaterial = new StandardMaterial
            ("groundMat", this);
        material.diffuseTexture = new Texture("assets/heightMap.png", this);
        (material.diffuseTexture as Texture).uScale = 100;
        (material.diffuseTexture as Texture).vScale = 100;
        myGround.material = material;

        myGround.physicsImpostor = new BABYLON.PhysicsImpostor(myGround, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });

        this.initializeControls();
    }

    protected update(): void {
        if (this.m_camera !== undefined && this.m_car !== undefined) {
            var cam: ArcFollowCamera = this.m_camera as ArcFollowCamera;
            cam.target = this.m_car.transform;            

            cam.radius = 50;
            
            this.m_car.updatePhysics(this.dt, this.gravity);
        }
    }

    private m_car!: Car;
    private m_steerLeft!: boolean;
    private m_steerRight!: boolean;
    private m_gui: CarGUI;
}