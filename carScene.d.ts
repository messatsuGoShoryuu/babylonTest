import CustomizableScene from "./customizableScene";
import { Engine, ActionEvent } from "babylonjs";
export default class CarScene extends CustomizableScene {
    constructor(name: string, engine: Engine);
    protected onLevelLoaded(): void;
    protected isKeyPressed(query: string, event: ActionEvent): boolean;
    protected isKeyReleased(query: string, event: ActionEvent): boolean;
    protected initializeControls(): void;
    protected initialize(): void;
    protected update(): void;
    private m_car;
    private m_steerLeft;
    private m_steerRight;
    private m_gui;
}
