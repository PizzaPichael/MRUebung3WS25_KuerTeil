/*
* This component removes specified components when an event fires.
*/
AFRAME.registerComponent('on-event-deactivate-components', {
    schema: {
        event: { type: 'string', default: '' },
        listenOn: { type: 'string', default: 'entity' }, // 'entity' or 'scene'
        target: { type: 'string', default: '' }, // Use entity id here
        components: { type: 'array', default: [] } // Array of component names to deactivate
    },

    /*
    * Validates inputs and wires the event listener.
    * Normalizes components list and handles string or array with brackets
    */
    init: function () {
        if (!this.data.event || this.data.event === '') {
            return;
        }

        if (!this.data.components || this.data.components.length === 0) {
            return;
        }

        if (typeof this.data.components === 'string') {
            this.data.components = this.data.components.split(',');
        }
        this.data.components = this.data.components
            .map((name) => String(name).trim())
            .map((name) => name.replace(/^\[/, '').replace(/\]$/, ''))
            .filter((name) => name.length > 0);

        if (this.data.components.length === 0) {
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

        this.deactivateComponentsBound = this.deactivateComponents.bind(this);
        this.targetElement = target;
        target.addEventListener(this.data.event, this.deactivateComponentsBound);
    },

    /*
    * Removes the listed components from the entity.
    */
    deactivateComponents: function () {
        this.data.components.forEach((componentName) => {
            if (this.el.hasAttribute(componentName)) {
                this.el.removeAttribute(componentName);
            }
        });
        this.remove();
    },

    /*
    * Removes the event listener when the component is detached.
    */
    remove: function () {
        if (this.deactivateComponentsBound && this.targetElement) {
            this.targetElement.removeEventListener(this.data.event, this.deactivateComponentsBound);
        }
    }
});
