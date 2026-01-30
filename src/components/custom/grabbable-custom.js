/*
* This component was written in collaboration with GitHub Copilot to make objects grabbable in VR scenes
* as the exsiting packages I could not get to work with my project.
* Collaboration mainly involved figuring out how to change the ammo-body parameters mid render as it is
* almost impossible to do. But Copilot figured out a way for this in the onGrabEnd function.
*/

AFRAME.registerComponent('grabbable-custom', {
    schema: { 
        changeEntityPhysicsToDynamic: { type: 'boolean', default: false },
        isPlug: { type: 'boolean', default: false } 
    },

    /*
    * The init function ensures the object has ammo-body for physics,
    * sets a variable and flag and registers event listeners to events
    * that are emitted from the hand-grab component on the controllers.
    */
    init: function () {

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

    /*
    * Tries to set the ammo-body type to kinematic (although this virtually never works because
    * somehow it is not possible to change the parameters of the ammo-body and shape component while
    * the scene is running)
    * and sets the grabbed flag as well as emits an event if the grabbed object is the plug.
    * Sets the gravity of the grabbed object to zero.
    */
    onGrabStart: function () {
        console.log('onGrabStart');
        if (this.originalBodyType === 'static') {
            this.el.setAttribute('ammo-body', 'type', 'kinematic');
        }
        this.isGrabbed = true;
        if(this.data.isPlug) {
            this.el.emit('plug-grabbed');
        }

        this.el.setAttribute('ammo-body', 'gravity', '0 0 0');
    },

    /*
    * Handles setting the obejcts ammo-body back to a physics influecned body, if needed.
    */
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

    /*
    * Handles the removal process of the compoennt if needed.
    */
    remove: function () {
        this.el.removeEventListener('grab-start', this.onGrabStart);
        this.el.removeEventListener('grab-end', this.onGrabEnd);
    }
});