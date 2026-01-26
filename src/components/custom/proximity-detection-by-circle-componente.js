/*
This component allows for an entity to change its components attribute values when the camera/player reaches a certain
designated proximity plane.
Several components to change can be given to the component via an array.
The component supports both the list and a single target input as I was to lazy to change the old single target
variante on some entities.
The version with several targets was used on the spawn-text-planes component f.e.

Can be assigned to any entity.
*/
AFRAME.registerComponent('proximity-circle', {
    schema: {
        // Array of objects in format: {target: selector, component: string, attribute: string, value: boolean}
        changes: { type: 'array', default: [] },

        // Support for old single target format
        target: { type: 'selector', default: null },
        componentToChange: { type: 'string', default: '' },
        compAttrToChange: { type: 'string', default: '' },
        compAttrNewBoolValue: { type: 'boolean', default: false }
    },

    init: function () {
        this.camera = this.el.sceneEl.camera;
        this.targets = [];

        // Adding targets to check the proximity for in the multiple targets array way
        if (this.data.changes && this.data.changes.length > 0) {
            this.data.changes.forEach((change) => {
                if (change.target && change.component && change.attribute && change.value !== undefined) {
                    const targetElement = document.querySelector(change.target);
                    if (targetElement) {
                        const targetWorldPos = new THREE.Vector3();
                        targetElement.object3D.getWorldPosition(targetWorldPos);

                        this.targets.push({
                            element: targetElement,
                            worldPos: targetWorldPos,
                            radius: targetElement.getAttribute('radius') || 0,
                            component: change.component,
                            attribute: change.attribute,
                            value: change.value,
                            isInside: false
                        });
                    } else {
                        console.warn('proximity-circle: target not found:', change.target);
                    }
                } else {
                    console.warn('proximity-circle: invalid change object, missing properties:', change);
                }
            });
        }

        // Support for old single target format
        if (this.data.target && this.data.componentToChange && this.data.compAttrToChange) {
            const targetWorldPos = new THREE.Vector3();
            this.data.target.object3D.getWorldPosition(targetWorldPos);

            this.targets.push({
                element: this.data.target,
                worldPos: targetWorldPos,
                radius: this.data.target.getAttribute('radius') || 0,
                component: this.data.componentToChange,
                attribute: this.data.compAttrToChange,
                value: this.data.compAttrNewBoolValue,
                isInside: false
            });
        }
    },

    checkIfCameraInTarget: function (target) {
        const cameraWorldPosition = new THREE.Vector3();
        this.camera.getWorldPosition(cameraWorldPosition);

        const vecOne = new THREE.Vector2(cameraWorldPosition.x, cameraWorldPosition.z);
        const vecTwo = new THREE.Vector2(target.worldPos.x, target.worldPos.z);
        const distanceToTarget = vecOne.distanceTo(vecTwo);

        return distanceToTarget <= target.radius;
    },

    // Checks the distance to each target with each tick
    tick: function () {
        this.targets.forEach((target) => {
            const isInside = this.checkIfCameraInTarget(target);

            if (isInside) {
                this.el.setAttribute(target.component, target.attribute, target.value);
            } else {
                this.el.setAttribute(target.component, target.attribute, !target.value);
            }

            target.isInside = isInside;
        });
    },

    remove: function () {
        this.targets = [];
        this.camera = null;
    }
});