
import {Scene, AssetsManager, Engine} from "babylonjs"
import Car from "./car"

export default class CustomizableScene extends Scene
{    
    constructor(name: string, engine: Engine)
    {
        super(engine);
        this.m_name = name;
        this.m_assetsManager = new AssetsManager(this);
    }

    private m_assetsManager: AssetsManager;
    private m_name: string;
}