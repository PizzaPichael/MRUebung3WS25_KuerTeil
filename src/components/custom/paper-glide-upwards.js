/*
* This component moves an entity upward and rotates it toward the camera.
*/
AFRAME.registerComponent('glide-upwards', {
    schema: {
        enabled: { type: 'boolean', default: true },
        speed: { type: 'number', default: 0.05 },
        heightOffset: { type: 'number', default: 0.0 }
    },

    /*
    * Initializes reference transforms and the target rotation.
    */
    init: function() {
        this.camera = this.el.sceneEl.camera;
        this.initialPosition = this.el.object3D.position.clone();
        this.initialQuaternion = this.el.object3D.quaternion.clone();
        this.targetQuaternion = new THREE.Quaternion();
        this.targetQuaternion.setFromEuler(new THREE.Euler(
            0, 
            THREE.MathUtils.degToRad(90),
            THREE.MathUtils.degToRad(90)
        ));
    },

    /*
    * Updates position and rotation each frame based on state.
    */
    tick: function() {
        if (!this.data.enabled) {
            if (!this.el.object3D.quaternion.equals(this.initialQuaternion)) {
                this.el.object3D.quaternion.slerp(this.initialQuaternion, this.data.speed);
            }
            if (!this.el.object3D.position.equals(this.initialPosition)){
                this.el.object3D.position.lerp(this.initialPosition, this.data.speed);
            }
            return;
        }
        
        if (this.camera) {
            const cameraWorldPosition = new THREE.Vector3();
            this.camera.getWorldPosition(cameraWorldPosition);
            
            let newPosition = null;
            if(this.data.heightOffset === 0.0) { 
                newPosition = new THREE.Vector3(this.initialPosition.x, cameraWorldPosition.y, this.initialPosition.z);
            } else {
                newPosition = new THREE.Vector3(this.initialPosition.x, cameraWorldPosition.y + this.data.heightOffset, this.initialPosition.z);
            }
            
            this.el.object3D.position.lerp(newPosition, this.data.speed);
            this.el.object3D.quaternion.slerp(this.targetQuaternion, this.data.speed);

        }
    }
});