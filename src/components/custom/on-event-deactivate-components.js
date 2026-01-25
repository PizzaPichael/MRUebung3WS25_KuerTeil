AFRAME.registerComponent('on-event-deactivate-components', {
    schema: {
        event: { type: 'string', default: '' },
        listenOn: { type: 'string', default: 'entity' }, // 'entity' or 'scene'
        target: { type: 'string', default: '' }, // Use entity id here
        components: { type: 'array', default: [] } // Array of component names to deactivate
    },

    init: function () {
        if (!this.data.event || this.data.event === '') {
            return;
        }

        if (!this.data.components || this.data.components.length === 0) {
            return;
        }

        // Normalize components list (handles string or array with brackets)
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

        this.deactivateComponentsBound = this.deactivateComponents.bind(this);
        this.targetElement = target; // Store for cleanup
        target.addEventListener(this.data.event, this.deactivateComponentsBound);
    },

    deactivateComponents: function () {
        // Deactivate each component in the list
        this.data.components.forEach((componentName) => {
            if (this.el.hasAttribute(componentName)) {
                this.el.removeAttribute(componentName);
            }
        });
        this.remove();
    },

    remove: function () {
        if (this.deactivateComponentsBound && this.targetElement) {
            this.targetElement.removeEventListener(this.data.event, this.deactivateComponentsBound);
        }
    }
});
