import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh, AssetsManager, MeshAssetTask, TransformNode, Light, FreeCamera, UniversalCamera } from "babylonjs";
import 'babylonjs-loaders';
import Car from './car';

module TestGame
{
    class Game
    {
        run(): void 
        {
            this.createScene();
        }

        constructor(canvasElement: string)
        {
            this.m_canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
            this.m_engine = new Engine(this.m_canvas, true);
            this.m_scenes = new Array<Scene>();
            this.m_scenes.push(new Scene(this.m_engine));
            this.m_currentScene = 0;
            this.m_assetsManager = new AssetsManager(this.currentScene);
        }

        get currentScene() : Scene 
        {
            return this.m_scenes[this.m_currentScene];
        }


        private createScene(): void
        {
            this.m_camera = new UniversalCamera("MainCamera", new Vector3(0, 10, -10), this.currentScene);
            this.m_light = new HemisphericLight("light1", new Vector3(1, 1, 0), this.currentScene);

            var meshTask: MeshAssetTask = this.m_assetsManager.addMeshTask("redbullCar", "redbullCar", "assets/Redbull/", "Car.obj");

            var car: Car;

            meshTask.onSuccess = (task: MeshAssetTask) =>
            {
                car = new Car(task.loadedMeshes, "RedbullCar", this.currentScene);                
            }

            this.m_assetsManager.onFinish = (tasks) =>
            {
                this.m_engine.runRenderLoop(() =>
                {
                    this.currentScene.render();
                });
            };
            this.m_assetsManager.load();
        }

        private m_canvas: HTMLCanvasElement;
        private m_engine: Engine;
        private m_camera!: UniversalCamera;
        private m_light!: Light;
        private m_assetsManager: AssetsManager;
        private m_scenes: Array<Scene>;
        private m_currentScene: number;
    }

    var game = new Game("renderCanvas");
    game.run();
}



