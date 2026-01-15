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
        this.camera = null;
        this.isActive = true;
        this.isSimpleComponent = false;
        if(this.data.compAttrToChange === '') {
            console.log(this.data.componentToChange);
            const componentSchema = AFRAME.components[this.data.componentToChange].schema;
            this.isSimpleComponent = !!componentSchema.type; 
            console.log(this.isSimpleComponsent);
        }
        if (this.data.componentToChange != '') {
            this.changeComponent = this.el.components[this.data.componentToChange];
            this.isActive = true;
        } else {
            this.isActive = false;
            console.warn('proximity-detection-by-plane: componentToChange not provided');
        }
        this.cameraInsideTarget = false;
    },

    checkIfCameraInTarget: function() {
        if (!this.camera) {
            this.camera = this.el.sceneEl.camera;
            if (!this.camera) return;
        }
        
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
            if (this.isSimpleComponent) {
                this.el.setAttribute(this.data.componentToChange, this.data.compAttrNewBoolValue);
            } else {
                this.el.setAttribute(this.data.componentToChange, this.data.compAttrToChange, this.data.compAttrNewBoolValue);
            }
        }
    
        if(this.cameraInsideTarget === false) {
            if (!this.isSimpleComponent) {
                this.el.setAttribute(this.data.componentToChange, !this.data.compAttrNewBoolValue);
            } else {
                this.el.setAttribute(this.data.componentToChange, this.data.compAttrToChange, !this.data.compAttrNewBoolValue);
            }
        }
    }
});