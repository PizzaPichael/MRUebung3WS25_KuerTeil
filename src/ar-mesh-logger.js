AFRAME.registerComponent('ar-mesh-logger', {
  init: function() {
    this.onEnterVR = this.onEnterVR.bind(this);
    this.logInterval = null;
    this.previousPlaneCount = 0;
    this.planeEntities = new Map(); // Speichert gerenderte Plane-Entities
    
    // Warte bis die Szene geladen ist
    if (this.el.sceneEl.hasLoaded) {
      this.el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
    } else {
      this.el.sceneEl.addEventListener('loaded', () => {
        this.el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
      });
    }
  },

  onEnterVR: function() {
    if (this.el.sceneEl.is('ar-mode')) {
      console.log('=== AR-Modus betreten - Ausgabe aller Meshes und Planes ===');
      this.logScene();
      // Initiale Ausgabe
      /*this.logMeshesAndPlanes();
      
      // Wiederhole alle 5 Sekunden
      this.logInterval = setInterval(() => {
        this.logMeshesAndPlanes();
      }, 5000);*/
    }
  },

  tick: function(time, timeDelta) {
    const frame = this.el.sceneEl.frame;
    
    if (frame && frame.detectedMeshes) {
      const currentMeshCount = frame.detectedMeshes.size;
      
      if (currentMeshCount !== this.previousPlaneCount) {
        console.log('Meshes geändert! Neue Anzahl:', currentMeshCount);
        let wallCounter = 0;
        frame.detectedMeshes.forEach((mesh, index) => {
          console.log('Mesh:', mesh);
          if(mesh.semanticLabel === "wall") {
            wallCounter+=1;            
          }
          this.renderMesh(mesh, frame);
        });
        console.log('Anzahl Wände:', wallCounter);
        this.previousPlaneCount = currentMeshCount;
      }
    }
  },

  renderMesh: function(xrMesh, frame) {
    const scene = this.el.sceneEl;
    const referenceSpace = scene.renderer.xr.getReferenceSpace();
    
    // Hole Pose des Meshes
    const pose = frame.getPose(xrMesh.meshSpace, referenceSpace);
    if (!pose) return;
    
    const position = pose.transform.position;
    const orientation = pose.transform.orientation;
    
    // Erstelle BufferGeometry aus vertices und indices
    const geometry = new THREE.BufferGeometry();
    
    // Vertices sind als Float32Array mit [x,y,z, x,y,z, ...] Format
    geometry.setAttribute('position', new THREE.BufferAttribute(xrMesh.vertices, 3));
    
    // Indices für die Dreiecke
    geometry.setIndex(new THREE.BufferAttribute(xrMesh.indices, 1));
    
    // Berechne Normalen für korrektes Lighting
    geometry.computeVertexNormals();
    
    // Erstelle Material (halbtransparent)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    
    // Erstelle Mesh
    const mesh = new THREE.Mesh(geometry, material);
    
    // Setze Position
    mesh.position.set(position.x, position.y, position.z);
    
    // Setze Rotation aus Quaternion
    mesh.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w);
    
    // Füge zur Szene hinzu
    scene.object3D.add(mesh);
    
    console.log('Mesh gerendert:', position, 'Vertices:', xrMesh.vertices.length / 3);
  },


  logScene: function() {
    const el = this.el;
    const scene = el.sceneEl;
    const frame = scene.frame;
    
    console.log('=== Scene Details ===');
    console.dir(scene);
    
    if (frame) {
      console.log('=== Frame Details ===');
      console.dir(frame);
      
      /* Zugriff auf detectedMeshes
      if (frame.detectedMeshes) {
        console.log(`=== Detected Planes (${frame.detectedMeshes.size}) ===`);
        
        frame.detectedMeshes.forEach((plane, index) => {
          console.log(`Plane ${index}:`, plane);
          
          // Pose des Planes
          if (plane.planeSpace) {
            const pose = frame.getPose(plane.planeSpace, scene.renderer.xr.getReferenceSpace());
            if (pose) {
              console.log('  Position:', pose.transform.position);
              console.log('  Orientation:', pose.transform.orientation);
            }
          }
          
          // Polygon (Vertices)
          console.log('  Polygon:', plane.polygon);
          
          // Orientation (horizontal/vertical)
          console.log('  Orientation:', plane.orientation);
        });
      } else {
        console.log('Keine detectedMeshes verfügbar');
      }*/
    } else {
      console.log('Kein Frame verfügbar');
    }
  },

  logMeshesAndPlanes: function() {
    // Alle Entities mit mesh Komponente
    const meshEntities = this.el.sceneEl.querySelectorAll('[mesh]');
    console.log(`Gefundene Meshes: ${meshEntities.length}`);
    meshEntities.forEach((entity, index) => {
      console.log(`Mesh ${index + 1}:`, entity);
      console.log('  Position:', entity.getAttribute('position'));
      console.log('  Rotation:', entity.getAttribute('rotation'));
    });

    // Alle plane Entities
    const planeEntities = this.el.sceneEl.querySelectorAll('a-plane, [geometry="primitive: plane"]');
    console.log(`Gefundene Planes: ${planeEntities.length}`);
    planeEntities.forEach((entity, index) => {
      console.log(`Plane ${index + 1}:`, entity);
      console.log('  Position:', entity.getAttribute('position'));
      console.log('  Rotation:', entity.getAttribute('rotation'));
    });

    console.log('=== Ende der Ausgabe ===');
  },

  remove: function() {
    if (this.logInterval) {
      clearInterval(this.logInterval);
    }
    this.el.sceneEl.removeEventListener('enter-vr', this.onEnterVR);
  }
});