/*
*  This component was written in collaboration with GitHub Copilot to enable grabbing and releasing objects in VR scenes
*  as the exsiting packages I could not get to work with my project.
*/
AFRAME.registerComponent('hand-grab', {
    schema: {},

    /*
    * Initializes grab state, handlers, and collision geometry for the hand.
    */
    init: function () {

        this.grabbedObject = null;
        this.onTriggerDown = this.onTriggerDown.bind(this);
        this.onTriggerUp = this.onTriggerUp.bind(this);

        this.el.addEventListener('gripdown', this.onTriggerDown);
        this.el.addEventListener('gripup', this.onTriggerUp);

        this.collisionSphere = document.createElement('a-sphere');
        this.collisionSphere.setAttribute('radius', 0.03);
        this.collisionSphere.setAttribute('opacity', 0); 
        this.collisionSphere.setAttribute('position', '0 0 0');
        this.el.appendChild(this.collisionSphere);
    },

    /*
    * Checks for a nearby grabbable and starts grabbing if one is found.
    */
    onTriggerDown: function () {

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

    /*
    * Releases the currently grabbed object on trigger up.
    */
    onTriggerUp: function () {
        if (this.grabbedObject) {
            this.releaseObject();
        }
    },

    /*
    * Emits grab event and tracks relative transform for the grabbed object.
    */
    grabObject: function (object) {
        this.grabbedObject = object;

        object.emit('grab-start');
        if (object.hasAttribute('ammo-body')) {
            object.setAttribute('ammo-body', 'type', 'kinematic');
        }

        if (!object || !object.object3D) {
            return;
        }

        if (!object.userData) {
            object.userData = {};
        }

        const handWorldPosition = new THREE.Vector3();
        const handWorldQuaternion = new THREE.Quaternion();
        const objectWorldPosition = new THREE.Vector3();
        const objectWorldQuaternion = new THREE.Quaternion();

        this.el.object3D.getWorldPosition(handWorldPosition);
        this.el.object3D.getWorldQuaternion(handWorldQuaternion);
        object.object3D.getWorldPosition(objectWorldPosition);
        object.object3D.getWorldQuaternion(objectWorldQuaternion);

        const relativePosition = new THREE.Vector3().subVectors(objectWorldPosition, handWorldPosition);
        const relativeQuaternion = objectWorldQuaternion.multiply(handWorldQuaternion.clone().invert());

        object.userData.relativePosition = relativePosition;
        object.userData.relativeQuaternion = relativeQuaternion;

        this.el.object3D.attach(object.object3D);

        this.el.sceneEl.addEventListener('tick', () => {
            if (this.grabbedObject === object) {
                const updatedHandWorldPosition = new THREE.Vector3();
                const updatedHandWorldQuaternion = new THREE.Quaternion();

                this.el.object3D.getWorldPosition(updatedHandWorldPosition);
                this.el.object3D.getWorldQuaternion(updatedHandWorldQuaternion);

                const newWorldPosition = updatedHandWorldPosition.clone().add(object.userData.relativePosition.clone().applyQuaternion(updatedHandWorldQuaternion));
                const newWorldQuaternion = updatedHandWorldQuaternion.clone().multiply(object.userData.relativeQuaternion);

                object.object3D.position.copy(newWorldPosition);
                object.object3D.quaternion.copy(newWorldQuaternion);
            }
        });
    },

    /*
    * Emits release event and detaches the object from the hand.
    */
    releaseObject: function () {
        if (this.grabbedObject) {
            this.grabbedObject.emit('grab-end');

            this.el.sceneEl.object3D.attach(this.grabbedObject.object3D);
            this.grabbedObject = null;
        }
    },

    /*
    * Cleans up event listeners when the component is removed.
    */
    remove: function () {
        this.el.removeEventListener('gripdown', this.onTriggerDown);
        this.el.removeEventListener('gripup', this.onTriggerUp);
    }
});