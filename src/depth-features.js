AFRAME.registerComponent('depth-heatmap', {
  schema: {
    enabled: { type: 'boolean', default: true }
  },

  init: function() {
    this.depthCanvas = document.createElement('canvas');
    this.depthContext = this.depthCanvas.getContext('2d');
    this.depthTexture = null;
    this.material = null;
    this.referenceSpace = null;
    this.depthSupported = false;
    
    // Reference Space speichern wenn XR Session startet
    this.el.sceneEl.addEventListener('enter-vr', () => {
      const xr = this.el.sceneEl.renderer.xr;
      const session = xr.getSession();
      if (session) {
        // Prüfe ob Depth-Sensing verfügbar ist
        this.depthSupported = session.enabledFeatures && 
          session.enabledFeatures.includes('depth-sensing');
        
        if (this.depthSupported) {
          console.log('Depth-Sensing ist verfügbar');
        } else {
          console.warn('Depth-Sensing nicht verfügbar - Heatmap deaktiviert');
        }
        
        session.requestReferenceSpace('local').then((refSpace) => {
          this.referenceSpace = refSpace;
        });
      }
    });
    
    // Plane für die Heatmap erstellen
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(0, 1.6, -1.5);
    this.el.object3D.add(this.mesh);
  },

  tick: function() {
    if (!this.data.enabled || !this.depthSupported) return;

    const sceneEl = this.el.sceneEl;
    const frame = sceneEl.frame;
    
    if (!frame || !this.referenceSpace) return;

    const pose = frame.getViewerPose(this.referenceSpace);
    
    if (!pose) return;

    try {
      // Erste View nehmen (für Mono oder linkes Auge)
      const view = pose.views[0];
      const depthInfo = frame.getDepthInformation(view);
      
      if (depthInfo) {
        this.renderDepthHeatmap(depthInfo);
      }
    } catch (error) {
      // Depth-Sensing nicht verfügbar - silent fail
      this.depthSupported = false;
    }
  },

  renderDepthHeatmap: function(depthInfo) {
    const width = depthInfo.width;
    const height = depthInfo.height;
    
    // Canvas Größe anpassen
    if (this.depthCanvas.width !== width || this.depthCanvas.height !== height) {
      this.depthCanvas.width = width;
      this.depthCanvas.height = height;
    }

    const imageData = this.depthContext.createImageData(width, height);
    const data = imageData.data;

    // Tiefendaten in Farbwerte konvertieren
    for (let i = 0; i < width * height; i++) {
      const depth = depthInfo.data[i];
      const normalized = Math.min(depth / 5.0, 1.0); // 5m max Tiefe
      
      // Heatmap Farben: nah = rot, mittel = gelb, weit = blau
      let r, g, b;
      if (normalized < 0.5) {
        r = 255;
        g = Math.floor(normalized * 2 * 255);
        b = 0;
      } else {
        r = Math.floor((1 - normalized) * 2 * 255);
        g = Math.floor((1 - normalized) * 2 * 255);
        b = Math.floor((normalized - 0.5) * 2 * 255);
      }
      
      data[i * 4] = r;
      data[i * 4 + 1] = g;
      data[i * 4 + 2] = b;
      data[i * 4 + 3] = 255;
    }

    this.depthContext.putImageData(imageData, 0, 0);
    
    // Texture aktualisieren
    if (!this.depthTexture) {
      this.depthTexture = new THREE.CanvasTexture(this.depthCanvas);
      this.material.map = this.depthTexture;
    }
    this.depthTexture.needsUpdate = true;
  }
});

// Surface Placement für Lightbulb
AFRAME.registerComponent('surface-placement', {
  schema: {
    targetId: { type: 'string', default: 'lightbulb' }
  },

  init: function() {
    this.referenceSpace = null;
    this.depthSupported = false;
    this.placedObjects = [];
    
    // Reference Space speichern wenn XR Session startet
    this.el.sceneEl.addEventListener('enter-vr', () => {
      const xr = this.el.sceneEl.renderer.xr;
      const session = xr.getSession();
      if (session) {
        // Prüfe ob Depth-Sensing verfügbar ist
        this.depthSupported = session.enabledFeatures && 
          session.enabledFeatures.includes('depth-sensing');
        
        session.requestReferenceSpace('local').then((refSpace) => {
          this.referenceSpace = refSpace;
        });
      }
    });
    
    // Touch/Click Event Listener
    this.el.sceneEl.addEventListener('click', this.onSelect.bind(this));
    
    console.log('Surface Placement aktiviert - Tippe zum Platzieren');
  },

  onSelect: function(evt) {
    const sceneEl = this.el.sceneEl;
    const frame = sceneEl.frame;
    
    if (!frame || !this.referenceSpace) return;

    const pose = frame.getViewerPose(this.referenceSpace);
    if (!pose) return;

    const view = pose.views[0];
    let depthInfo = null;
    
    // Versuche Depth-Information zu bekommen, falls verfügbar
    if (this.depthSupported) {
      try {
        depthInfo = frame.getDepthInformation(view);
      } catch (error) {
        console.warn('Depth-Information nicht verfügbar:', error.message);
        this.depthSupported = false;
      }
    }
    
    if (depthInfo) {
      // Bildschirmmitte als Platzierungspunkt mit Depth-Daten
      const surfacePosition = this.getSurfaceAtCenter(depthInfo, view);
      
      if (surfacePosition) {
        this.placeLightbulb(surfacePosition);
      }
    } else {
      // Fallback: Platziere vor der Kamera wenn kein Depth verfügbar
      const camera = sceneEl.camera;
      const position = new THREE.Vector3(0, 0, -1.5);
      position.applyMatrix4(camera.matrixWorld);
      this.placeLightbulb(position);
      console.log('Lightbulb ohne Depth-Daten platziert (Fallback)');
    }
  },

  getSurfaceAtCenter: function(depthInfo, view) {
    const width = depthInfo.width;
    const height = depthInfo.height;
    
    // Zentrum der Tiefenkarte
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const index = centerY * width + centerX;
    
    const depth = depthInfo.data[index];
    
    if (depth <= 0 || depth > 10) return null; // Ungültige Tiefe
    
    // UV zu NDC (Normalized Device Coordinates)
    const u = centerX / width;
    const v = centerY / height;
    const ndc = new THREE.Vector3(
      u * 2 - 1,
      -(v * 2 - 1),
      depth
    );
    
    // Transformiere mit der inversen Projektionsmatrix
    const projectionMatrix = new THREE.Matrix4().fromArray(view.projectionMatrix);
    const invProjection = new THREE.Matrix4().copy(projectionMatrix).invert();
    
    const viewPos = ndc.applyMatrix4(invProjection);
    
    // Transformiere in World Space
    const viewMatrix = new THREE.Matrix4().fromArray(view.transform.inverse.matrix);
    const worldPos = viewPos.applyMatrix4(viewMatrix.invert());
    
    return worldPos;
  },

  placeLightbulb: function(position) {
    // Neues Lightbulb Entity erstellen
    const lightbulb = document.createElement('a-entity');
    lightbulb.setAttribute('gltf-model', '#lightbulb');
    lightbulb.setAttribute('position', {
      x: position.x,
      y: position.y,
      z: position.z
    });
    lightbulb.setAttribute('scale', '0.1 0.1 0.1');
    
    this.el.sceneEl.appendChild(lightbulb);
    this.placedObjects.push(lightbulb);
    
    console.log(`Lightbulb platziert bei: ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`);
  }
});
