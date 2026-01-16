AFRAME.registerComponent('look-at-camera', {
  schema: {
    enabled: { type: 'boolean', default: true },
    speed: { type: 'number', default: 0.05 },
    idleEntityId: { type: 'string', default: '' }
  },

  init: function () {
    this.lookAtIdle = false;
    this.idleEntity = null;

    if (this.data.idleEntityId != '') {
      this.lookAtIdle = true;
      this.idleEntity = this.el.sceneEl.querySelector(this.data.idleEntityId);
    }
    this.camera = this.el.sceneEl.camera;
    this.initialQuaternion = this.el.object3D.quaternion.clone();
  },

  smoothRotateToQuaternion: function (targetQuaternion, speed) {
    this.el.object3D.quaternion.slerp(targetQuaternion, speed);
  },

  smoothLookAt: function (targetPosition, speed) {
    const tempObj = new THREE.Object3D();
    tempObj.position.copy(this.el.object3D.position);
    tempObj.lookAt(targetPosition);
    this.el.object3D.quaternion.slerp(tempObj.quaternion, speed);
  },

  tick: function () {
    if (!this.data.enabled) {
      if (this.lookAtIdle && this.idleEntity) {
        const idleEntityWorldPosition = new THREE.Vector3();
        this.idleEntity.object3D.getWorldPosition(idleEntityWorldPosition);
        this.smoothLookAt(idleEntityWorldPosition, this.data.speed);
      } else if (!this.el.object3D.quaternion.equals(this.initialQuaternion)) {
        this.smoothRotateToQuaternion(this.initialQuaternion, this.data.speed);
      }
      return;
    }

    // enabled ist true - schau zur Kamera
    const cameraWorldPosition = new THREE.Vector3();
    this.camera.getWorldPosition(cameraWorldPosition);
    this.smoothLookAt(cameraWorldPosition, this.data.speed);
  }
});

