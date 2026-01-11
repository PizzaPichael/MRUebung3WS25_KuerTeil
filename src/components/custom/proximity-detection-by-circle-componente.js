AFRAME.registerComponent('proximity-circle', {
    schema: {
        target: { type: 'selector' },
        componentToChange: { type: 'string', default: ''},
        compAttrToChange: {type: 'string', default: ''},
        compAttrNewBoolValue: {type: 'boolean', default: false},
        compAttrNewPosValues: {type: 'string', default: ''}
    },
    init: function() {
        this.targetWorldPos = new THREE.Vector3(); 
        this.data.target.object3D.getWorldPosition(this.targetWorldPos);
        this.targetRadius = this.data.target.getAttribute('radius') || 0;
        this.camera = this.el.sceneEl.camera;
        this.isActive = true;
        if (this.data.componentToChange != '' && this.data.compAttrToChange != '') {
            this.changeComponent = this.el.components[this.data.componentToChange];
            this.isActive = true;
        } else {
            this.isActive = false;
            console.warn('proximity-detection-by-plane: componentToChange not provided');
        }
        this.cameraInsideTarget = false;
    },

    checkIfCameraInTarget: function() {
        const cameraWorldPosition = new THREE.Vector3();
        this.camera.getWorldPosition(cameraWorldPosition);

        const vecOne = new THREE.Vector2(cameraWorldPosition.x, cameraWorldPosition.z);
        const vecTwo = new THREE.Vector2(this.targetWorldPos.x, this.targetWorldPos.z); 
        const distanceToTarget = vecOne.distanceTo(vecTwo);
        if(distanceToTarget <= this.targetRadius) {
            this.cameraInsideTarget = true;
        } else {
            this.cameraInsideTarget = false;
        }
    },

    tick: function() {
        if (!this.isActive) return;

        this.checkIfCameraInTarget();
        if(this.cameraInsideTarget === true) {
            this.el.setAttribute(this.data.componentToChange, this.data.compAttrToChange, this.data.compAttrNewBoolValue);
        }
    
        if(this.cameraInsideTarget === false) {
            this.el.setAttribute(this.data.componentToChange, this.data.compAttrToChange, !this.data.compAttrNewBoolValue);
        }
    }
});