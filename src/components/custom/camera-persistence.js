/*
This component is for debugging purposes only and has been written by copilot.
Supports both desktop (look-controls) and VR modes.
*/
AFRAME.registerComponent('camera-persistence', {
  schema: {
    enabled: { type: 'boolean', default: false }
  },

  init: function () {
    this.isVRMode = false;

    // Checkbox-Status aus localStorage laden
    const savedEnabled = localStorage.getItem('cameraPersistenceEnabled');
    if (savedEnabled !== null) {
      this.data.enabled = savedEnabled === 'true';
      // Checkbox updaten
      const checkbox = document.getElementById('persistCheckbox');
      if (checkbox) checkbox.checked = this.data.enabled;
    }

    // VR-Mode Detection
    this.scene = this.el.sceneEl;
    this.scene.addEventListener('enter-vr', this.onEnterVR.bind(this));
    this.scene.addEventListener('exit-vr', this.onExitVR.bind(this));

    // Wenn enabled, gespeicherte Position/Rotation laden
    if (this.data.enabled) {
      this.loadCameraState();
    }

    // Event Listener für vor dem Unload
    this.beforeUnloadHandler = this.saveCameraState.bind(this);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  },

  onEnterVR: function () {
    this.isVRMode = true;
    console.log('Entered VR mode');

    // Restore the last saved position after a short delay to ensure WebXR is initialized
    if (this.data.enabled) {
      const savedPosition = localStorage.getItem('cameraPosition');
      if (savedPosition) {
        const position = savedPosition.split(' ').map(parseFloat);
        setTimeout(() => {
          this.el.object3D.position.set(position[0], position[1], position[2]);
          console.log('Camera position restored in VR after WebXR initialization:', savedPosition);
        }, 500); // Delay to ensure WebXR initialization
      }
    }
  },

  onExitVR: function () {
    this.isVRMode = false;
    console.log('Exited VR mode');
  },

  loadCameraState: function () {
    const savedPosition = localStorage.getItem('cameraPosition');
    const savedRotation = localStorage.getItem('cameraRotation');

    if (savedPosition) {
      this.el.setAttribute('position', savedPosition);
      console.log('Camera position restored:', savedPosition);
    }

    // Rotation nur im Desktop-Modus setzen
    if (savedRotation && !this.isVRMode) {
      // Rotation verzögert setzen, nachdem look-controls initialisiert ist
      setTimeout(() => {
        this.el.setAttribute('rotation', savedRotation);

        // look-controls interne Rotation ebenfalls setzen
        const lookControls = this.el.components['look-controls'];
        if (lookControls) {
          const rot = savedRotation.split(' ').map(parseFloat);
          lookControls.pitchObject.rotation.x = THREE.MathUtils.degToRad(rot[0]);
          lookControls.yawObject.rotation.y = THREE.MathUtils.degToRad(rot[1]);
        }

        console.log('Camera rotation restored:', savedRotation);
      }, 100);
    }
  },

  saveCameraState: function () {
    if (!this.data.enabled) return;

    const position = this.el.getAttribute('position');
    const rotation = this.el.getAttribute('rotation');

    const posString = `${position.x.toFixed(2)} ${position.y.toFixed(2)} ${position.z.toFixed(2)}`;
    const rotString = `${rotation.x.toFixed(1)} ${rotation.y.toFixed(1)} ${rotation.z.toFixed(1)}`;

    localStorage.setItem('cameraPosition', posString);
    localStorage.setItem('cameraRotation', rotString);
    console.log('Camera state saved' + (this.isVRMode ? ' (VR mode)' : ''));
  },

  update: function (oldData) {
    // Enabled-Status speichern
    localStorage.setItem('cameraPersistenceEnabled', this.data.enabled);
  },

  remove: function () {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    if (this.scene) {
      this.scene.removeEventListener('enter-vr', this.onEnterVR);
      this.scene.removeEventListener('exit-vr', this.onExitVR);
    }
  }
});
