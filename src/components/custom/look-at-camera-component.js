/*
This component enables an entity to look at the camera/player by rotating with the players movement.
The direction the entity looks at is along its z axis.
Can be added to any entity.
Can be dynamicly disabled f.e. by proximity which rotates the entity back to its initial state.
A manual camera object can be added f.e. if set to an entity inside a .js component, which needs an 
entity to be passed to in order to work.
*/
AFRAME.registerComponent('look-at-camera', {
  schema: {
    enabled: { type: 'boolean', default: true },
    speed: { type: 'number', default: 0.05 },
    idleEntityId: { type: 'string', default: '' },
    manualCamera: { type: 'selector', default: null }
  },

  init: function () {
    this.lookAtIdle = false;
    this.idleEntity = null;

    if (this.data.idleEntityId != '') {
      this.lookAtIdle = true;
      this.idleEntity = this.el.sceneEl.querySelector(this.data.idleEntityId);
    }
    // Get any available camera
    this.cameraEl =
      this.data.manualCamera ||
      (this.el.sceneEl.camera && this.el.sceneEl.camera.el) ||
      this.el.sceneEl.querySelector('[camera]');
    
    this.initialQuaternion = this.el.object3D.quaternion.clone();
  },

  // Takes a quaternion and slerps/rotates towards it.
  smoothRotateToQuaternion: function (targetQuaternion, speed) {
    this.el.object3D.quaternion.slerp(targetQuaternion, speed);
  },

  // Smoothly rotates from one quaternion to another.
  // Uses a temporary object to look at the desired target, which then provides us with a quaternion
  // that the entity needs to change to, if it should look at the target.
  smoothLookAt: function (targetPosition, speed) {
    const tempObj = new THREE.Object3D();
    tempObj.position.copy(this.el.object3D.position);
    tempObj.lookAt(targetPosition);
    this.el.object3D.quaternion.slerp(tempObj.quaternion, speed);
  },

  tick: function () {
    // If not enabled, the entity should smoothly rotate back to its initial orientation or look at an idle entity
    if (!this.data.enabled) {
      if (this.lookAtIdle && this.idleEntity) {
        // If an idle entity is set, while the compoenent is not enabled f.e. because the playser has not entered
        // a proximity plane, the entity looks/turns at/towards the idle entity.
        const idleEntityWorldPosition = new THREE.Vector3();
        this.idleEntity.object3D.getWorldPosition(idleEntityWorldPosition);
        this.smoothLookAt(idleEntityWorldPosition, this.data.speed);
      } else if (!this.el.object3D.quaternion.equals(this.initialQuaternion)) {
        // If the actual and original orientation dont match, rotate back to original orientation
        this.smoothRotateToQuaternion(this.initialQuaternion, this.data.speed);
      }
      return;
    }

    // If the omponent is enabled, the entity looks at the camera/player
    const cameraWorldPosition = new THREE.Vector3();
    // Make sure camera is selected
    if (!this.cameraEl) {
      this.cameraEl =
        this.data.manualCamera ||
        (this.el.sceneEl.camera && this.el.sceneEl.camera.el) ||
        this.el.sceneEl.querySelector('[camera]');
    }
    if (this.cameraEl) {
      this.cameraEl.object3D.getWorldPosition(cameraWorldPosition);
    } else {
      return;
    }
    
    this.smoothLookAt(cameraWorldPosition, this.data.speed);
  },

  // Remove function, returns the entity to its inital oriantation and remove alls references from the component
  remove: function () {
    if (this.initialQuaternion) {
      this.el.object3D.quaternion.copy(this.initialQuaternion);
    }

    this.camera = null;
    this.idleEntity = null;
  }
});

