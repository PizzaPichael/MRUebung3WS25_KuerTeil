AFRAME.registerComponent('on-event-activate-gravity', {
    schema: {
        event: { type: 'string', default: '' },
        listenOn: { type: 'string', default: 'entity' }, // 'entity' or 'scene'
        target: { type: 'string', default: '' }, // Use entity id here
        onlyGravity: { type: 'boolean', default: false } // If true, only activate gravity, keep static (preserves animation)
    },

    init: function () {
        if(!this.data.event || this.data.event === '') {
            return;
        }

        // Store original ammo-body configuration
        if (this.el.hasAttribute('ammo-body')) {
            const body = this.el.getAttribute('ammo-body');
            this.originalBodyType = body.type || 'static';
            this.originalBodyConfig = { ...body };
        } else {
            this.originalBodyType = 'static';
            this.originalBodyConfig = {};
        }

        // Determine where to listen for the event
        let target;
        if (this.data.target) {
            // Listen on a specific entity (e.g., the plug entity)
            target = this.el.sceneEl.querySelector(this.data.target);
            if (!target) {
                return;
            }
        } else {
            // Use listenOn setting
            target = this.data.listenOn === 'scene' ? this.el.sceneEl : this.el;
        }
        
        this.activateGravityBound = this.activateGravity.bind(this);
        this.targetElement = target; // Store for cleanup
        target.addEventListener(this.data.event, this.activateGravityBound);
    },

    activateGravity: function () {
        
        // If onlyGravity is true, just activate gravity without changing to dynamic
        // This preserves the animation
        if (this.data.onlyGravity) {
            const body = this.el.getAttribute('ammo-body') || {};
            this.el.setAttribute('ammo-body', {
                ...body,
                gravity: '0 -9.8 0'
            });
            return;
        }
        
        // Otherwise, stop animation and switch to dynamic
        if (this.el.components.animation) {
            // Stop and remove animation
            this.el.components.animation.pause();
            this.el.removeAttribute('animation');
            // Wait a frame to ensure animation is fully stopped
            this.el.sceneEl.addEventListener('tick', this.onAnimationStopped = () => {
                this.el.sceneEl.removeEventListener('tick', this.onAnimationStopped);
                this.switchToDynamic();
            }, { once: true });
        } else {
            // No animation, switch immediately
            this.switchToDynamic();
        }
    },

    switchToDynamic: function () {
        const body = this.el.getAttribute('ammo-body') || {};
        
        // Change to dynamic WITHOUT removing the component
        // This preserves all original parameters (like ammo-shape)
        this.el.setAttribute('ammo-body', {
            ...body,
            type: 'dynamic',
            mass: body.mass || 1,
            gravity: '0 -9.8 0'
        });
        
    
        // Update Ammo physics body directly
        if (this.el.body) {
            this.el.body.setCollisionFlags(0); // 0 = dynamic in Ammo
            this.el.body.activate();
        } else {
            // Retry after a short delay
            setTimeout(() => {
                if (this.el.body) {
                    this.el.body.setCollisionFlags(0);
                    this.el.body.activate();
                }
            }, 100);
        }
    },

    remove: function () {
        if (this.activateGravityBound && this.targetElement) {
            this.targetElement.removeEventListener(this.data.event, this.activateGravityBound);
        }
    }
});