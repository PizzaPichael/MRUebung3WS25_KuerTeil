// This component was written in collaboration with GitHub Copilot to make objects grabbable in VR scenes
// as the exsiting packages I could not get to work with my project.

AFRAME.registerComponent('grabbable-custom', {
    schema: { 
        changeEntityPhysicsToDynamic: { type: 'boolean', default: false },
        isPlug: { type: 'boolean', default: false } 
    },

    init: function () {
        // Ensure the object has ammo-body for physics
        if (!this.el.hasAttribute('ammo-body')) {
            console.warn('Grabbable objects must have an ammo-body component.');
            return;
        }

        const body = this.el.getAttribute('ammo-body');
        if (!body) {
            console.error('ammo-body attribute is missing or invalid.');
            return;
        }

        this.originalBodyType = body.type || 'static';
        this.isGrabbed = false;

        this.el.addEventListener('grab-start', this.onGrabStart.bind(this));
        this.el.addEventListener('grab-end', this.onGrabEnd.bind(this));
    },

    onGrabStart: function () {
        console.log('onGrabStart');
        if (this.originalBodyType === 'static') {
            this.el.setAttribute('ammo-body', 'type', 'kinematic');
        }
        this.isGrabbed = true;
        if(this.data.isPlug) {
            console.log('emitting plug-grabbed event');
            console.log('el', this.el);
            this.el.emit('plug-grabbed');
        }

        // Disable gravity while the object is grabbed
        this.el.setAttribute('ammo-body', 'gravity', '0 0 0');
    },

    onGrabEnd: function () {
        if (!this.isGrabbed) return;
      
        const body = this.el.getAttribute('ammo-body') || {};
      
        if (this.data.changeEntityPhysicsToDynamic) {
          this.el.setAttribute('ammo-body', {
            ...body,
            type: 'dynamic',
            mass: body.mass || 1  
          });
      
          if (this.el.body) {
            this.el.body.setCollisionFlags(0); 
            this.el.body.activate();
          }
          this.el.setAttribute('ammo-body', {
            ...this.el.getAttribute('ammo-body'),
            gravity: '0 -9.8 0'
          });

        } else {
          this.el.setAttribute('ammo-body', {
            ...body,
            type: this.originalBodyType,
            mass: 0
          });
          if (this.el.body) {
            this.el.body.setCollisionFlags(1);
            this.el.body.activate();
          }
          this.el.setAttribute('ammo-body', {
            ...this.el.getAttribute('ammo-body'),
            gravity: '0 0 0'
          });
        }
      
        this.isGrabbed = false;
        if (this.data.isPlug) {
            this.el.emit('plug-removed');
        }
      },

    remove: function () {
        this.el.removeEventListener('grab-start', this.onGrabStart);
        this.el.removeEventListener('grab-end', this.onGrabEnd);
    },

    play: function () {
        // Optional: Add any logic when the object becomes active
    },

    pause: function () {
        // Optional: Add any logic when the object becomes inactive
    }
});