import { TransformNode, AbstractMesh, Scene } from "babylonjs";
export default class Car {
    constructor(meshes: Array<AbstractMesh>, name: string, scene: Scene);
    readonly transform: TransformNode;
    private m_transform;
    private m_meshes;
}
