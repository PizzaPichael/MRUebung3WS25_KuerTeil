/*
* This deprecated component toggles visibility on an event.
*/
AFRAME.registerComponent('on-event-switch-visibility', {
    schema: {
        event: { type: 'string', default: '' },
        listenOn: { type: 'string', default: 'entity' },
        target: { type: 'string', default: '' },
    },

    /*
    * Wires the event listener based on target configuration.
    */
    init: function () {
        if(!this.data.event || this.data.event === '') {
            return;
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
        
        this.targetElement = target;
        target.addEventListener(this.data.event, this.switchVisibility.bind(this));
    },

    /*
    * Toggles the visible attribute on the entity.
    */
    switchVisibility: function() {
        const currentVisible = this.el.getAttribute('visible');
        console.log('currentVisible', currentVisible);
        this.el.setAttribute('visible', !currentVisible);
    }
    
});