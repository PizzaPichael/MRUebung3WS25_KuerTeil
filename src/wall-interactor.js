AFRAME.registerComponent('wall-object-spawner', {
  init: function() {
    this.el.addEventListener('realworldmeshing-ready', () => {
      this.spawnObjectsOnWalls();
    });
  },
  
  spawnObjectsOnWalls: function() {
    // Finde alle erkannten Planes mit dem Label "wall"
    const planes = document.querySelectorAll('[data-xr-plane-label="wall"]');
    
    planes.forEach((plane) => {
      // Hole Position und Größe der Plane
      const position = plane.object3D.position;
      const geometry = plane.getAttribute('geometry');
      
      // Erstelle ein Objekt in der Mitte der Wand
      const object = document.createElement('a-box');
      object.setAttribute('position', {
        x: position.x,
        y: position.y,
        z: position.z
      });
      object.setAttribute('color', 'red');
      object.setAttribute('scale', '0.2 0.2 0.2');
      
      this.el.sceneEl.appendChild(object);
    });
  }
});
