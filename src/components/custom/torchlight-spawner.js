// This component adds lights to the throneroom above the torch models.
AFRAME.registerComponent('torchlight-spawner', {
    schema: {
        torchHeight: { type: 'number', default: 5.41 },
        heightOffset: { type: 'number', default: 0.3 },
        color: { type: 'color', default: '#ffb357' },
        intensity: { type: 'number', default: 5 },
        distance: { type: 'number', default: 60 },
        decay: { type: 'number', default: 1 },
        addAmbient: { type: 'boolean', default: true },
        ambientColor: { type: 'color', default: '#ffffff' },
        ambientIntensity: { type: 'number', default: 0.05 }
    },

    init: function () {
        // Positions derive from the blender model
        const torchPositions = [
            { x: -8, z: -10 },
            { x: -8, z: 10 },
            { x: -8, z: 0 },
            { x: -4, z: -19 },
            { x: -4, z: -13 },
            { x: 4, z: 13 },
            { x: 4, z: -19 },
            { x: 8, z: 0 },
            { x: 8, z: 10 },
            { x: 8, z: -10 }
        ];

        // Gets the thronerooms scale as it was scaled after import.
        // But I have not yet figured out, why setting normal hight but scaled offsset sets the light in the right height.
        // TBD
        const scale = this.el.getAttribute('scale') || { x: 1, y: 1, z: 1 };
        const scaledOffset = this.data.heightOffset * scale.y;
        const lightY = this.data.torchHeight + scaledOffset;

        // Ambeint ligth added to scene
        if (this.data.addAmbient) {
            const existingAmbient = this.el.sceneEl.querySelector('#torch-ambient-light');
            if (!existingAmbient) {
                const ambientLight = document.createElement('a-entity');
                ambientLight.setAttribute('id', 'torch-ambient-light');
                ambientLight.setAttribute('light', {
                    type: 'ambient',
                    color: this.data.ambientColor,
                    intensity: this.data.ambientIntensity
                });
                this.el.sceneEl.appendChild(ambientLight);
            }
        }

        torchPositions.forEach((pos, index) => {
            const lightEntity = document.createElement('a-entity');
            lightEntity.setAttribute('id', `torch-light-${index}`);
            lightEntity.setAttribute('position', `${pos.x} ${lightY} ${pos.z}`);
            lightEntity.setAttribute('light', {
                type: 'point',
                color: this.data.color,
                intensity: this.data.intensity,
                distance: this.data.distance,
                decay: this.data.decay
            });

            // Flicker to make the light feel like fire
            const flickerBase = this.data.intensity;
            // Each light gets random values so that the lights do not flicker synchronous
            const flickerLow = flickerBase * THREE.MathUtils.randFloat(0.6, 0.8);
            const flickerHigh = flickerBase * THREE.MathUtils.randFloat(0.9, 1.1);
            const flickerDur = THREE.MathUtils.randInt(400, 899);
            const flickerDelay = THREE.MathUtils.randInt(0, 199);

            lightEntity.setAttribute('animation__flicker', {
                property: 'light.intensity',
                dir: 'alternate',
                dur: flickerDur,
                delay: flickerDelay,
                loop: true,
                easing: 'easeInOutSine',
                to: flickerLow
            });

            lightEntity.setAttribute('animation__flickerHigh', {
                property: 'light.intensity',
                dir: 'alternate',
                dur: flickerDur + 150,      // Add values to prevent both animation attributes to be synchroneous for one light
                delay: flickerDelay + 50,
                loop: true,
                easing: 'easeInOutSine',
                to: flickerHigh
            });

            this.el.appendChild(lightEntity);
        });
    }
});
