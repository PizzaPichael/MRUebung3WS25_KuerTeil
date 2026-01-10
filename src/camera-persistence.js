AFRAME.registerComponent('camera-persistence', {
  schema: {
    enabled: { type: 'boolean', default: false }
  },
  
  init: function() {
    // Checkbox-Status aus localStorage laden
    const savedEnabled = localStorage.getItem('cameraPersistenceEnabled');
    if (savedEnabled !== null) {
      this.data.enabled = savedEnabled === 'true';
      // Checkbox updaten
      const checkbox = document.getElementById('persistCheckbox');
      if (checkbox) checkbox.checked = this.data.enabled;
    }
    
    // Wenn enabled, gespeicherte Position/Rotation laden
    if (this.data.enabled) {
      this.loadCameraState();
    }
    
    // Event Listener für vor dem Unload
    this.beforeUnloadHandler = this.saveCameraState.bind(this);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  },
  
  loadCameraState: function() {
    const savedPosition = localStorage.getItem('cameraPosition');
    const savedRotation = localStorage.getItem('cameraRotation');
    
    if (savedPosition) {
      this.el.setAttribute('position', savedPosition);
      console.log('Camera position restored:', savedPosition);
    }
    
    if (savedRotation) {
      this.el.setAttribute('rotation', savedRotation);
      console.log('Camera rotation restored:', savedRotation);
    }
  },
  
  saveCameraState: function() {
    if (!this.data.enabled) return;
    
    const position = this.el.getAttribute('position');
    const rotation = this.el.getAttribute('rotation');
    
    const posString = `${position.x.toFixed(2)} ${position.y.toFixed(2)} ${position.z.toFixed(2)}`;
    const rotString = `${rotation.x.toFixed(1)} ${rotation.y.toFixed(1)} ${rotation.z.toFixed(1)}`;
    
    localStorage.setItem('cameraPosition', posString);
    localStorage.setItem('cameraRotation', rotString);
    console.log('Camera state saved');
  },
  
  update: function(oldData) {
    // Enabled-Status speichern
    localStorage.setItem('cameraPersistenceEnabled', this.data.enabled);
  },
  
  remove: function() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }
});
