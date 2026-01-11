AFRAME.registerComponent('look-at-camera', {
  schema: {
    enabled: { type: 'boolean', default: true },
    speed: { type: 'number', default: 0.05 }
  },

  init: function() {
    this.camera = this.el.sceneEl.camera;
    this.initialQuaternion = this.el.object3D.quaternion.clone();
  },

  smoothRotateToQuaternion: function(targetQuaternion, speed) {
    this.el.object3D.quaternion.slerp(targetQuaternion, speed);
  },

  smoothLookAt: function(targetPosition, speed) {
    const tempObj = new THREE.Object3D();
    tempObj.position.copy(this.el.object3D.position);
    tempObj.lookAt(targetPosition);
    this.el.object3D.quaternion.slerp(tempObj.quaternion, speed);
  },
  
  tick: function() {
    if (!this.data.enabled) {
      if (!this.el.object3D.quaternion.equals(this.initialQuaternion)) {
        this.smoothRotateToQuaternion(this.initialQuaternion, this.data.speed);
      }
      return;
    }
    
    if (this.camera) {
      const cameraWorldPosition = new THREE.Vector3();
      this.camera.getWorldPosition(cameraWorldPosition);
      
      this.smoothLookAt(cameraWorldPosition, this.data.speed);
    }
  }
});

