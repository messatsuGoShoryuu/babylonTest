import { TransformNode, AbstractMesh, Scene, Vector3, ArcFollowCamera, Mesh, PhysicsImpostor, MeshBuilder } from "babylonjs";

export default class Car {
    constructor(meshes: Array<AbstractMesh>, name: string, scene: Scene) {
        this.m_meshes = meshes;
        this.m_physicsRoot = new Mesh("PhysicsRoot", scene);
        this.m_name = name;

        this.m_meshes.forEach((m, i) => {
            if (m.name.indexOf("box") != -1) {
                m.isVisible = false
                this.m_physicsRoot.addChild(m)
            }
        })

        // Add all root nodes within the loaded gltf to the physics root
        this.m_meshes.forEach((m, i) => {
            if (m.parent == null) {
                this.m_physicsRoot.addChild(m)
            }
        })


    }

    initializePhysics(scene: Scene): void {
        // Make every collider into a physics impostor
        this.m_physicsRoot.getChildMeshes().forEach((m) => {            
            var b = MeshBuilder.CreateBox("box", {width : m.getBoundingInfo().maximum.x - m.getBoundingInfo().minimum.x, height: m.getBoundingInfo().maximum.y - m.getBoundingInfo().minimum.y},scene);

            this.m_physicsRoot.addChild(b);
            b.physicsImpostor = new PhysicsImpostor(b, PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
        });

        // Scale the root object and turn it into a physics impsotor
        this.m_physicsRoot.scaling.scaleInPlace(0.2);

        this.m_physicsRoot.physicsImpostor = new PhysicsImpostor(this.m_physicsRoot, PhysicsImpostor.NoImpostor, { mass: 3 }, scene);
    }

    get transform(): AbstractMesh {
        return this.m_physicsRoot;
    }

    private m_name: string;
    private m_meshes: Array<AbstractMesh>;
    private m_physicsRoot: Mesh;
}
