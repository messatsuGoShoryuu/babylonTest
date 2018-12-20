import { AbstractMesh, Scene } from "babylonjs";
export default class Car {
    constructor(meshes: Array<AbstractMesh>, name: string, scene: Scene);
    initializePhysics(scene: Scene): void;
    readonly transform: AbstractMesh;
    private m_name;
    private m_meshes;
    private m_physicsRoot;
}
