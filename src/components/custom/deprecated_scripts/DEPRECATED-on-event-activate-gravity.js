/*
* This deprecated component activates gravity on an event.
*/
AFRAME.registerComponent('on-event-activate-gravity', {
    schema: {
        event: { type: 'string', default: '' },
        listenOn: { type: 'string', default: 'entity' }, // 'entity' or 'scene'
        target: { type: 'string', default: '' }, // Use entity id here
        onlyGravity: { type: 'boolean', default: false } // If true, only activate gravity, keep static (preserves animation)
    },

    /*
    * Stores original physics settings and wires the event listener.
    */
    init: function () {
        if(!this.data.event || this.data.event === '') {
            return;
        }

        if (this.el.hasAttribute('ammo-body')) {
            const body = this.el.getAttribute('ammo-body');
            this.originalBodyType = body.type || 'static';
            this.originalBodyConfig = { ...body };
        } else {
            this.originalBodyType = 'static';
            this.originalBodyConfig = {};
        }

        let target;
        if (this.data.target) {
            target = this.el.sceneEl.querySelector(this.data.target);
            if (!target) {
                return;
            }
        } else {
            target = this.data.listenOn === 'scene' ? this.el.sceneEl : this.el;
        }
        
        this.activateGravityBound = this.activateGravity.bind(this);
        this.targetElement = target;
        target.addEventListener(this.data.event, this.activateGravityBound);
    },

    /*
    * Enables gravity, optionally stopping animation first.
    */
    activateGravity: function () {
        
        if (this.data.onlyGravity) {
            const body = this.el.getAttribute('ammo-body') || {};
            this.el.setAttribute('ammo-body', {
                ...body,
                gravity: '0 -9.8 0'
            });
            return;
        }
        
        if (this.el.components.animation) {
            this.el.components.animation.pause();
            this.el.removeAttribute('animation');
            this.el.sceneEl.addEventListener('tick', this.onAnimationStopped = () => {
                this.el.sceneEl.removeEventListener('tick', this.onAnimationStopped);
                this.switchToDynamic();
            }, { once: true });
        } else {
            this.switchToDynamic();
        }
    },

    /*
    * Switches the ammo-body to dynamic and activates the physics body.
    */
    switchToDynamic: function () {
        const body = this.el.getAttribute('ammo-body') || {};
        
        this.el.setAttribute('ammo-body', {
            ...body,
            type: 'dynamic',
            mass: body.mass || 1,
            gravity: '0 -9.8 0'
        });
        
    
        if (this.el.body) {
            this.el.body.setCollisionFlags(0);
            this.el.body.activate();
        } else {
            setTimeout(() => {
                if (this.el.body) {
                    this.el.body.setCollisionFlags(0);
                    this.el.body.activate();
                }
            }, 100);
        }
    },

    /*
    * Removes the event listener when the component is detached.
    */
    remove: function () {
        if (this.activateGravityBound && this.targetElement) {
            this.targetElement.removeEventListener(this.data.event, this.activateGravityBound);
        }
    }
});