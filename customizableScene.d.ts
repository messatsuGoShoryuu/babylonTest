import { Scene, AssetsManager, Engine, Camera, Light, MeshAssetTask } from "babylonjs";
export default class CustomizableScene extends Scene {
    constructor(name: string, engine: Engine);
    load(): void;
    protected onLevelLoaded(): void;
    protected mainLoop(): void;
    readonly dt: number;
    protected initialize(): void;
    protected loadMesh(meshName: string, meshPath: string, meshFileName: string, callback: (task: MeshAssetTask) => void): void;
    protected update(): void;
    protected m_assetsManager: AssetsManager;
    private m_name;
    protected m_camera: Camera;
    protected m_light: Light;
    readonly name: string;
}
