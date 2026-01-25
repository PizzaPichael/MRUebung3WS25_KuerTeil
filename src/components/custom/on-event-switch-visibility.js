AFRAME.registerComponent('on-event-switch-visibility', {
    schema: {
        event: { type: 'string', default: '' },
        listenOn: { type: 'string', default: 'entity' }, // 'entity' or 'scene'
        target: { type: 'string', default: '' }, // Use entity id here
    },

    init: function () {
        if(!this.data.event || this.data.event === '') {
            return;
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
        
        this.targetElement = target; // Store for cleanup
        target.addEventListener(this.data.event, this.switchVisibility.bind(this));
    },

    switchVisibility: function() {
        const currentVisible = this.el.getAttribute('visible');
        console.log('currentVisible', currentVisible);
        this.el.setAttribute('visible', !currentVisible);
    }
    
});