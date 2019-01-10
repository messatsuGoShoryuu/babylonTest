import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh, AssetsManager, MeshAssetTask, TransformNode, Light, FreeCamera, UniversalCamera } from "babylonjs";
import 'babylonjs-loaders';
import Car from './car';
import CustomizableScene from './customizableScene';
import CarScene from './carScene';

module TestGame
{
    class Game
    {
        run(): void 
        {            
            this.m_scenes[this.m_currentScene].load();
        }

        constructor(canvasElement: string)
        {
            this.m_canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
            this.m_engine = new Engine(this.m_canvas, true);
            this.m_scenes = new Array<CustomizableScene>();
            this.m_scenes.push(new CarScene("MainScene", this.m_engine));
            this.m_currentScene = 0;
        }

        get currentScene() : Scene 
        {
            return this.m_scenes[this.m_currentScene];
        }

        private m_canvas: HTMLCanvasElement;
        private m_engine: Engine;
        private m_scenes: Array<CustomizableScene>;
        private m_currentScene: number;
    }

    var game = new Game("renderCanvas");
    game.run();
}



