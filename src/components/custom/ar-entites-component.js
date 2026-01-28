AFRAME.registerComponent('ar-entites-component', {
    schema: {
        ambientColor: { type: 'color', default: '#ffffff' },
        ambientIntensity: { type: 'number', default: 0.5 }
    },

    init: function () {
        
        //this.onEnterXR = this.onEnterXR.bind(this);
        //this.el.sceneEl.addEventListener('enter-vr', this.onEnterXR);
        this.onEnterXR();
    },

    onEnterXR: function () {
        // Add ambient light to scene
        const ambientLight = document.createElement('a-entity');
        ambientLight.setAttribute('id', 'torch-ambient-light');
        ambientLight.setAttribute('light', {
            type: 'ambient',
            color: this.data.ambientColor,
            intensity: this.data.ambientIntensity
        });
        this.el.sceneEl.appendChild(ambientLight);

        // Add a static ground plane for AR physics
        
        const ground = document.createElement('a-plane');
        ground.setAttribute('id', 'ar-ground-plane');
        ground.setAttribute('position', '0 0 0');
        ground.setAttribute('rotation', '-90 0 0');
        ground.setAttribute('width', 20);
        ground.setAttribute('height', 20);
        ground.setAttribute('visible', 'false');
        ground.setAttribute('ammo-body', 'type: static');
        ground.setAttribute('ammo-shape', 'type: box');
        this.el.appendChild(ground);
        

        // Add the computer to the scene
        const computer = document.createElement('a-entity');
        computer.setAttribute('id', 'ar-computer-entity');
        computer.setAttribute('gltf-model', '#computer');
        computer.setAttribute('position', '0 3 -20');
        computer.setAttribute('scale', '1 1 1');
        computer.setAttribute('rotation', '0 0 0');
        computer.setAttribute('visible', 'true');
        computer.setAttribute('hide-on-enter-vr', true);
        computer.setAttribute('look-at-camera', {
            enabled: true,
            manualCamera: '#head'
        });
        computer.setAttribute('animation', 'property: position; to: 0 3.5 -20; loop: true; dir: alternate; dur: 2000; easing: easeInOutQuad');

        const screenPlane = document.createElement('a-plane');
        screenPlane.setAttribute('position', '0 4.5 2.23');
        screenPlane.setAttribute('height', '3');
        screenPlane.setAttribute('width', '4.8');
        screenPlane.setAttribute('color', 'black');
        screenPlane.setAttribute('ammo-body', 'type: static');
        screenPlane.setAttribute('ammo-shape', 'type: box');

        const uiPlane = document.createElement('a-plane');
        uiPlane.setAttribute('src', '#chatgptscreenshot');
        uiPlane.setAttribute('position', '0 4.5 2.29');
        uiPlane.setAttribute('height', '2.5');
        uiPlane.setAttribute('width', '2.5');
        uiPlane.setAttribute('material', 'transparent: true; alphaTest: 0.5');
        uiPlane.setAttribute('animation', 'property: rotation; to: 0 0 -360; loop: true; dur: 5000; easing: easeInOutCubic');
        uiPlane.setAttribute('ammo-body', 'type: static');
        uiPlane.setAttribute('ammo-shape', 'type: box');

        const computerLight = document.createElement('a-entity');
        computerLight.setAttribute('id', 'computer-light');
        computerLight.setAttribute('position', '0 4.726 2.727');
        computerLight.setAttribute('light', 'type: point; color: #ffffff; distance: 2; decay: 1; intensity: 3');

        // Make the planes and light children of the computer
        computer.appendChild(screenPlane);
        computer.appendChild(uiPlane);
        computer.appendChild(computerLight);

        this.el.appendChild(computer);

        const emptyGenerator = document.createElement('a-entity');
        emptyGenerator.setAttribute('id', 'ar-emptyGenerator-entity');
        emptyGenerator.setAttribute('position', '0 0 2')
        emptyGenerator.setAttribute('rotation', '0 180 0');

        const generator = document.createElement('a-entity');
        generator.setAttribute('id', 'ar-diesel-generator-entity');
        generator.setAttribute('gltf-model', '#diesel-generator');
        generator.setAttribute('position', '-0.441 0 -0.585');
        generator.setAttribute('rotation', '0 -90 0');
        generator.setAttribute('scale', '2 2 2');
        generator.setAttribute('visible', 'true');

        const socket = document.createElement('a-entity');
        socket.setAttribute('id', 'ar-socket-entity');
        socket.setAttribute('gltf-model', '#socket');
        socket.setAttribute('position', '-0.056 0.873 0.047');
        socket.setAttribute('rotation', '0 -90 0');
        socket.setAttribute('visible', 'true');

        const plug = document.createElement('a-entity');
        plug.setAttribute('id', 'ar-plug-entity');
        plug.setAttribute('gltf-model', '#antenna-plug');
        plug.setAttribute('position', '-0.056 1.028 -0.05');
        plug.setAttribute('rotation', '0 180 180');
        plug.setAttribute('scale', '0.27 0.27 0.27');
        plug.setAttribute('visible', 'true');
        plug.setAttribute('ammo-body', 'type: dynamic; gravity: 0 0 0');
        plug.setAttribute('ammo-shape', {
            type: 'hull'
            });
        plug.setAttribute('grabbable-custom', 'changeEntityPhysicsToDynamic: true; isPlug: true');

        emptyGenerator.appendChild(generator)
        emptyGenerator.appendChild(socket);
        emptyGenerator.appendChild(plug);
        this.el.appendChild(emptyGenerator);
    }
});
