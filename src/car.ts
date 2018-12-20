import { TransformNode, AbstractMesh, Scene } from "babylonjs";

export default class Car
{
    constructor(meshes: Array<AbstractMesh>, name: string, scene: Scene)
    {
        this.m_meshes = meshes;
        this.m_transform = new TransformNode(name, scene);
        for (let i: number = 0; i < this.m_meshes.length; ++i)
        {
            this.m_meshes[i].parent = this.m_transform;
        }
    }

    get transform(): TransformNode 
    {
        return this.m_transform;
    }

    private m_transform: TransformNode;
    private m_meshes: Array<AbstractMesh>;
}
