import CustomizableScene from "./customizableScene";
import { Engine } from "babylonjs";
export default class CarScene extends CustomizableScene {
    constructor(name: string, engine: Engine);
    protected onLevelLoaded(): void;
    protected initialize(): void;
    protected update(): void;
    private m_car;
}
