AFRAME.registerComponent('proximity-plane', {
    schema: {
        target: { type: 'selector' },
        componentToChange: { type: 'string', default: ''},
        compAttrToChange: {type: 'string', default: ''},
        compAttrNewBoolValue: {type: 'boolean', default: false}
    },
    init: function() {
        this.targetWorldPos = new THREE.Vector3(); 
        this.data.target.object3D.getWorldPosition(this.targetWorldPos);
        this.targetRadius = this.data.target.getAttribute('radius') || 0;
        this.camera = this.el.sceneEl.camera;
        if (this.data.componentToChange != '') {
            this.changeComponent = this.el.components[this.data.componentToChange];
        } else {
            return;
        }
        this.cameraInsideTarget = false;
    },
    tick: function() {
        const cameraWorldPosition = new THREE.Vector3();
        this.camera.getWorldPosition(cameraWorldPosition);

        const vecOne = new THREE.Vector2(cameraWorldPosition.x, cameraWorldPosition.z);
        const vecTwo = new THREE.Vector2(this.targetWorldPos.x, this.targetWorldPos.z); 
        const distanceToTarget = vecOne.distanceTo(vecTwo);
        if(distanceToTarget <= this.targetRadius) {
            if(this.cameraInsideTarget === false) {
                this.el.setAttribute(this.data.componentToChange, this.data.compAttrToChange, this.data.compAttrNewBoolValue);
                this.cameraInsideTarget = !this.cameraInsideTarget;
            }
        } else {
            if(this.cameraInsideTarget === true) {
                this.el.setAttribute(this.data.componentToChange, this.data.compAttrToChange, !this.data.compAttrNewBoolValue);
                this.cameraInsideTarget = !this.cameraInsideTarget;
            }
        }
    }
});