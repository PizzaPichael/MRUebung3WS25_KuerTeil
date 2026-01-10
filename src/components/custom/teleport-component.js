/* 
This component has been written by Copilot, 
usind the a-frame blog entry https://aframe.io/blog/teleport-component/ as a reference.
I wasnt able to implement the existing teleport-component as it was too old.
*/
AFRAME.registerComponent('simple-teleport', {
  schema: {
    cameraRig: {type: 'selector', default: '#cameraRig'},
    button: {type: 'string', default: 'trigger'},
    curveHitColor: {type: 'color', default: '#00ff00'},
    curveMissColor: {type: 'color', default: '#9e0096'},
    hitCylinderColor: {type: 'color', default: '#00ffff'},
    hitCylinderRadius: {type: 'number', default: 0.3},
    maxDistance: {type: 'number', default: 10},
    curvePoints: {type: 'int', default: 30},
    gravity: {type: 'number', default: -9.8},
    speed: {type: 'number', default: 5}
  },

  init: function() {
    this.active = false;
    this.hitPoint = new THREE.Vector3();
    this.rigWorldPosition = new THREE.Vector3();
    
    // Erstelle Kurven-Line
    const points = [];
    for (let i = 0; i < this.data.curvePoints; i++) {
      points.push(new THREE.Vector3());
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: this.data.curveMissColor,
      linewidth: 2
    });
    
    this.curve = new THREE.Line(geometry, material);
    this.curve.visible = false;
    this.curve.frustumCulled = false; // Stelle sicher, dass die Linie immer gerendert wird
    this.el.sceneEl.object3D.add(this.curve); // Füge zur Szene hinzu, nicht zum Controller
    
    // Erstelle Hit-Marker (Zylinder)
    const cylinderGeometry = new THREE.CylinderGeometry(
      this.data.hitCylinderRadius, 
      this.data.hitCylinderRadius, 
      0.1, 
      32
    );
    const cylinderMaterial = new THREE.MeshBasicMaterial({
      color: this.data.hitCylinderColor,
      transparent: true,
      opacity: 0.7
    });
    
    this.hitMarker = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    this.hitMarker.visible = false;
    this.hitMarker.frustumCulled = false;
    this.el.sceneEl.object3D.add(this.hitMarker);
    
    // Raycaster für Kollisionserkennung
    this.raycaster = new THREE.Raycaster();
    
    // Sammle alle Objekte, die ignoriert werden sollen
    this.ignoreObjects = [];
    
    // Button Event Listener
    this.onButtonDown = this.onButtonDown.bind(this);
    this.onButtonUp = this.onButtonUp.bind(this);
    
    this.el.addEventListener(this.data.button + 'down', this.onButtonDown);
    this.el.addEventListener(this.data.button + 'up', this.onButtonUp);
  },

  onButtonDown: function() {
    this.active = true;
    this.curve.visible = true;
  },

  onButtonUp: function() {
    if (this.active && this.hitPoint) {
      this.teleport();
    }
    this.active = false;
    this.curve.visible = false;
    this.hitMarker.visible = false;
  },

  teleport: function() {
    if (!this.data.cameraRig) return;
    
    const rig = this.data.cameraRig;
    const rigPosition = this.rigWorldPosition;
    
    // Berechne den Offset zwischen Rig und Hit-Point
    const offset = new THREE.Vector3();
    offset.copy(this.hitPoint);
    offset.y = rigPosition.y; // Behalte Y-Position
    
    // Setze neue Rig-Position
    rig.object3D.position.copy(offset);
    
    // Emit Event
    this.el.emit('teleported', {
      oldPosition: rigPosition.clone(),
      newPosition: offset.clone(),
      hitPoint: this.hitPoint.clone()
    });
  },

  tick: function() {
    if (!this.active) return;
    
    const data = this.data;
    const el = this.el;
    const object3D = el.object3D;
    
    // Startposition und Richtung
    const p0 = new THREE.Vector3();
    object3D.getWorldPosition(p0);
    
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(object3D.quaternion);
    
    // Initiale Geschwindigkeit
    const v0 = direction.multiplyScalar(data.speed);
    
    // Berechne Kurve mit Physik
    const points = [];
    const positions = this.curve.geometry.attributes.position;
    let hit = false;
    let previousPoint = p0.clone();
    
    for (let i = 0; i < data.curvePoints; i++) {
      const t = i / data.curvePoints;
      
      // Parabelförmige Kurve: p(t) = p0 + v0*t + 0.5*a*t^2
      const point = new THREE.Vector3();
      point.x = p0.x + v0.x * t;
      point.y = p0.y + v0.y * t + 0.5 * data.gravity * t * t;
      point.z = p0.z + v0.z * t;
      
      points.push(point);
      
      // Prüfe Kollision zwischen vorherigem und aktuellem Punkt
      if (!hit) {
        const direction = new THREE.Vector3().subVectors(point, previousPoint);
        const distance = direction.length();
        
        this.raycaster.set(previousPoint, direction.normalize());
        this.raycaster.far = distance;
        
        // Prüfe Kollision mit allen Entities in der Szene
        const intersects = this.raycaster.intersectObjects(
          this.el.sceneEl.object3D.children, 
          true
        );
        
        // Filter: Ignoriere Controller, Kamera-Rig, Kurve und Hit-Marker
        const validIntersects = intersects.filter(intersect => {
          // Ignoriere die Kurve und den Hit-Marker
          if (intersect.object === this.curve || intersect.object === this.hitMarker) {
            return false;
          }
          
          // Ignoriere den Controller selbst
          if (intersect.object.el === this.el) {
            return false;
          }
          
          // Ignoriere das gesamte Camera-Rig und seine Kinder
          let parent = intersect.object;
          while (parent) {
            if (parent.el && (parent.el.id === 'cameraRig' || parent.el.id === 'head' || 
                parent.el.id === 'left-hand' || parent.el.id === 'right-hand')) {
              return false;
            }
            parent = parent.parent;
          }
          
          return true;
        });
        
        if (validIntersects.length > 0) {
          const intersect = validIntersects[0];
          
          // Prüfe ob die Oberfläche begehbar ist (Winkel-Check)
          let isWalkable = true;
          
          if (intersect.face && intersect.face.normal) {
            const normal = intersect.face.normal.clone();
            normal.transformDirection(intersect.object.matrixWorld);
            const angle = normal.angleTo(new THREE.Vector3(0, 1, 0));
            
            // Nur teleportieren wenn Oberfläche nicht zu steil ist (< 45 Grad)
            isWalkable = angle < Math.PI / 4;
          }
          
          if (isWalkable) {
            hit = true;
            this.hitPoint.copy(intersect.point);
            this.hitMarker.position.copy(this.hitPoint);
            this.hitMarker.visible = true;
            
            // Kürze Kurve am Hit-Point
            for (let j = i + 1; j < data.curvePoints; j++) {
              points.push(this.hitPoint.clone());
            }
            break;
          }
        }
        
        previousPoint = point.clone();
      }
    }
    
    // Aktualisiere Kurve
    for (let i = 0; i < data.curvePoints; i++) {
      positions.setXYZ(i, points[i].x, points[i].y, points[i].z);
    }
    positions.needsUpdate = true;
    
    // Aktualisiere Farbe
    this.curve.material.color.set(
      hit ? data.curveHitColor : data.curveMissColor
    );
    
    // Speichere Rig-Position für Teleport
    if (data.cameraRig) {
      data.cameraRig.object3D.getWorldPosition(this.rigWorldPosition);
    }
  },

  remove: function() {
    this.el.removeEventListener(this.data.button + 'down', this.onButtonDown);
    this.el.removeEventListener(this.data.button + 'up', this.onButtonUp);
    
    if (this.curve) {
      this.el.object3D.remove(this.curve);
    }
    
    if (this.hitMarker) {
      this.el.sceneEl.object3D.remove(this.hitMarker);
    }
  }
});
