import { TextBlock, AdvancedDynamicTexture } from "babylonjs-gui";
import EventManager from "./eventManager";

export default class CarGUI {
    constructor() {
        this.m_speedDisplay = new TextBlock();
        this.m_fullTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");


        this.m_speedDisplay.text = "qasdasd";
        this.m_speedDisplay.isVisible = true;
        this.m_speedDisplay.color = "white";
        this.m_speedDisplay.fontSize = 24;        
        this.m_fullTexture.addControl(this.m_speedDisplay);
            
       EventManager.addListener("GuiSpeedDisplay", this.updateSpeedDisplay.bind(this));
    }

    private updateSpeedDisplay(data: string): void {
        if(this.m_speedDisplay)
            this.m_speedDisplay.text = data;
    }

    private m_speedDisplay: TextBlock;
    private m_fullTexture: AdvancedDynamicTexture;
}