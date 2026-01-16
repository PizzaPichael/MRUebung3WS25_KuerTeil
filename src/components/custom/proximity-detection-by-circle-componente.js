AFRAME.registerComponent('proximity-circle', {
    schema: {
        // Array von Objekten im Format {target: selector, component: string, attribute: string, value: boolean}
        changes: { type: 'array', default: [] },

        // Support for old single-target format
        target: { type: 'selector', default: null },
        componentToChange: { type: 'string', default: '' },
        compAttrToChange: { type: 'string', default: '' },
        compAttrNewBoolValue: { type: 'boolean', default: false }
    },

    init: function () {
        this.camera = this.el.sceneEl.camera;
        this.targets = [];

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

        // Support for old single-target format
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
    }
});