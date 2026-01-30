/*
* This component teleports an entity when a specified event fires.
*/
AFRAME.registerComponent('on-event-teleport', {
    schema: {
        event: { type: 'string', default: '' },
        listenOn: { type: 'string', default: 'entity' }, // 'entity' or 'scene'
        target: { type: 'string', default: '' }, // Use entity id here
        position: { type: 'vec3', default: '0 0 0' },
        rotation: { type: 'vec3', default: '0 0 0' }
    },

    /*
    * Stores target transforms and wires the event listener.
    */
    init: function () {
        if(!this.data.event || this.data.event === '') {
            return;
        }

        this.targetPosition = new THREE.Vector3(
            this.data.position.x,
            this.data.position.y,
            this.data.position.z
        );

        this.targetRotation = new THREE.Vector3(
            this.data.rotation.x,
            this.data.rotation.y,
            this.data.rotation.z
        )

        let target;
        if (this.data.target) {
            target = this.el.sceneEl.querySelector(this.data.target);
            if (!target) {
                return;
            }
        } else {
            target = this.data.listenOn === 'scene' ? this.el.sceneEl : this.el;
        }
        
        this.teleportBound = this.teleportEntity.bind(this);
        this.targetElement = target;
        target.addEventListener(this.data.event, this.teleportBound);
    },

    /*
    * Applies the target position and rotation to the entity.
    */
    teleportEntity: function() {
        this.el.setAttribute('position', {
            x: this.targetPosition.x,
            y: this.targetPosition.y,
            z: this.targetPosition.z
        });

        this.el.setAttribute('rotation', {
            x: this.targetRotation.x,
            y: this.targetRotation.y,
            z: this.targetRotation.z
        });
    }
    
});