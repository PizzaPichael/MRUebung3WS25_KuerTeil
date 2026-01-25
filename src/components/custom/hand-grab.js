// This component was written in collaboration with GitHub Copilot to enable grabbing and releasing objects in VR scenes
// as the exsiting packages I could not get to work with my project.
AFRAME.registerComponent('hand-grab', {
    schema: {

    },

    init: function () {

        this.grabbedObject = null;
        this.onTriggerDown = this.onTriggerDown.bind(this);
        this.onTriggerUp = this.onTriggerUp.bind(this);

        // Add event listeners for controller events
        this.el.addEventListener('gripdown', this.onTriggerDown);
        this.el.addEventListener('gripup', this.onTriggerUp);

        // Create a collision sphere around the hand
        this.collisionSphere = document.createElement('a-sphere');
        this.collisionSphere.setAttribute('radius', 0.03);
        this.collisionSphere.setAttribute('opacity', 1); // Make it invisible
        this.collisionSphere.setAttribute('position', '0 0 0');
        this.el.appendChild(this.collisionSphere);
    },

    onTriggerDown: function () {

        // Check for intersections with the collision sphere using object geometry
        const objects = this.el.sceneEl.querySelectorAll('[grabbable-custom]');

        const sphere = new THREE.Sphere(this.collisionSphere.object3D.getWorldPosition(new THREE.Vector3()), 0.1);

        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            console.log('object', object);
            let mesh = null;
            object.object3D.traverse((child) => {
                if (child.isMesh && !mesh) {
                    mesh = child;
                }
            });

            if (mesh) {
                mesh.geometry.computeBoundingSphere();
                const boundingSphere = mesh.geometry.boundingSphere.clone();
                boundingSphere.applyMatrix4(mesh.matrixWorld);

                if (boundingSphere.intersectsSphere(sphere)) {
                    this.grabObject(object);
                    break;
                }
            }
        }
    },

    onTriggerUp: function () {
        if (this.grabbedObject) {
            this.releaseObject();
        }
    },

    grabObject: function (object) {
        this.grabbedObject = object;

        object.emit('grab-start');
        // Disable physics on the object
        if (object.hasAttribute('ammo-body')) {
            object.setAttribute('ammo-body', 'type', 'kinematic');
        }

        // Ensure the object and its object3D are valid
        if (!object || !object.object3D) {
            return;
        }

        // Ensure userData is initialized
        if (!object.userData) {
            object.userData = {};
        }

        // Attach the object to the hand
        const handWorldPosition = new THREE.Vector3();
        const handWorldQuaternion = new THREE.Quaternion();
        const objectWorldPosition = new THREE.Vector3();
        const objectWorldQuaternion = new THREE.Quaternion();

        // Get the current world position and rotation of the hand and object
        this.el.object3D.getWorldPosition(handWorldPosition);
        this.el.object3D.getWorldQuaternion(handWorldQuaternion);
        object.object3D.getWorldPosition(objectWorldPosition);
        object.object3D.getWorldQuaternion(objectWorldQuaternion);

        // Calculate the relative position and rotation of the object to the hand
        const relativePosition = new THREE.Vector3().subVectors(objectWorldPosition, handWorldPosition);
        const relativeQuaternion = objectWorldQuaternion.multiply(handWorldQuaternion.clone().invert());

        // Store the relative position and rotation for future updates
        object.userData.relativePosition = relativePosition;
        object.userData.relativeQuaternion = relativeQuaternion;

        // Attach the object to the hand
        this.el.object3D.attach(object.object3D);

        // Update the object's position and rotation on each frame
        this.el.sceneEl.addEventListener('tick', () => {
            if (this.grabbedObject === object) {
                const updatedHandWorldPosition = new THREE.Vector3();
                const updatedHandWorldQuaternion = new THREE.Quaternion();

                this.el.object3D.getWorldPosition(updatedHandWorldPosition);
                this.el.object3D.getWorldQuaternion(updatedHandWorldQuaternion);

                // Update the object's position and rotation based on the hand's movement
                const newWorldPosition = updatedHandWorldPosition.clone().add(object.userData.relativePosition.clone().applyQuaternion(updatedHandWorldQuaternion));
                const newWorldQuaternion = updatedHandWorldQuaternion.clone().multiply(object.userData.relativeQuaternion);

                object.object3D.position.copy(newWorldPosition);
                object.object3D.quaternion.copy(newWorldQuaternion);
            }
        });
    },

    releaseObject: function () {
        if (this.grabbedObject) {
            this.grabbedObject.emit('grab-end');

            /*/ Re-enable physics on the object
            if (this.grabbedObject.hasAttribute('ammo-body')) {
                this.grabbedObject.setAttribute('ammo-body', 'type', 'dynamic');
            }*/

            // Detach the object from the hand
            this.el.sceneEl.object3D.attach(this.grabbedObject.object3D);
            this.grabbedObject = null;
        }
    },

    remove: function () {
        // Clean up event listeners
        this.el.removeEventListener('gripdown', this.onTriggerDown);
        this.el.removeEventListener('gripup', this.onTriggerUp);
    }
});