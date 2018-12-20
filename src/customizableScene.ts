
import { Scene, AssetsManager, Engine, Camera, UniversalCamera, Vector3, Light, HemisphericLight, MeshAssetTask, CannonJSPlugin, IPhysicsEngine} from "babylonjs"
import Car from "./car"

export default class CustomizableScene extends Scene {
    constructor(name: string, engine: Engine) {
        super(engine);
        this.m_name = name;
        this.m_assetsManager = new AssetsManager(this);
        var physicsPlugin : CannonJSPlugin = new CannonJSPlugin();
        this.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin);            
    }    

    public load(): void {
        //    this.m_camera = new UniversalCamera("MainCamera", new Vector3(0, 0, 0), this);
                
        this.m_light = new HemisphericLight("light1", new Vector3(1, 1, 0), this);
        this.m_assetsManager.onFinish = (tasks) => {
            this.onLevelLoaded();
            this.getEngine().runRenderLoop(() => {
                this.mainLoop();
            });
        }
        this.initialize();
        this.m_assetsManager.load();

    }

    protected onLevelLoaded() : void
    {

    }

    protected mainLoop(): void {
        this.update();        
        this.render();
    }

    get dt(): number {
        return this.getEngine().getDeltaTime() * 0.001;
    }

    protected initialize(): void {

    }

    protected loadMesh(meshName: string, meshPath: string, meshFileName: string, callback: (task: MeshAssetTask) => void) {
        var meshTask: MeshAssetTask = this.m_assetsManager.addMeshTask(
            meshName, "", meshPath, meshFileName);

        meshTask.onSuccess = callback;
    }

    protected update(): void {

    }

    protected m_assetsManager: AssetsManager;
    private m_name: string;
    protected m_camera!: Camera;
    protected m_light!: Light;

    get name(): string {
        return this.m_name;
    }


}