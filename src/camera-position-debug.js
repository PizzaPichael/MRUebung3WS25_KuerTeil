AFRAME.registerComponent('camera-position-debug', {
  schema: {
    threshold: { type: 'number', default: 0.01 }, // Minimale Änderung zum Triggern
    autoLog: { type: 'boolean', default: false }  // Automatisches Logging an/aus
  },
  
  init: function() {
    this.lastPosition = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();
    this.lastRotation = new THREE.Euler();
    this.currentRotation = new THREE.Euler();
    
    // Initiale Position und Rotation speichern
    this.el.object3D.getWorldPosition(this.lastPosition);
    this.lastRotation.copy(this.el.object3D.rotation);
    
    // Öffentliche Methode zum manuellen Logging
    this.logCurrentState = this.logCurrentState.bind(this);
  },
  
  logCurrentState: function() {
    this.el.object3D.getWorldPosition(this.currentPosition);
    this.currentRotation.copy(this.el.object3D.rotation);
    
    const posX = this.currentPosition.x.toFixed(2);
    const posY = this.currentPosition.y.toFixed(2);
    const posZ = this.currentPosition.z.toFixed(2);
    const rotX = THREE.MathUtils.radToDeg(this.currentRotation.x).toFixed(1);
    const rotY = THREE.MathUtils.radToDeg(this.currentRotation.y).toFixed(1);
    const rotZ = THREE.MathUtils.radToDeg(this.currentRotation.z).toFixed(1);
    
    console.log('=== Camera State ===');
    console.log('Position:', `${posX} ${posY} ${posZ}`);
    console.log('Rotation:', `${rotX} ${rotY} ${rotZ}`);
    console.log('===================');
  },
  
  tick: function() {
    if (!this.data.autoLog) return;
    
    // Aktuelle Weltposition und Rotation holen
    this.el.object3D.getWorldPosition(this.currentPosition);
    this.currentRotation.copy(this.el.object3D.rotation);
    
    // Distanz zur letzten Position berechnen
    const distance = this.currentPosition.distanceTo(this.lastPosition);
    
    // Rotationsänderung berechnen (in Grad)
    const rotationDiff = Math.abs(this.currentRotation.x - this.lastRotation.x) +
                         Math.abs(this.currentRotation.y - this.lastRotation.y) +
                         Math.abs(this.currentRotation.z - this.lastRotation.z);
    
    // Ausgeben wenn sich Position oder Rotation signifikant geändert hat
    if (distance > this.data.threshold || rotationDiff > 0.01) {
      this.logCurrentState();
      
      // Letzte Werte aktualisieren
      this.lastPosition.copy(this.currentPosition);
      this.lastRotation.copy(this.currentRotation);
    }
  }
});
