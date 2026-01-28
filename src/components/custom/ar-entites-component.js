/*
 * AR Entities Component
 * Spawns all AR-specific entities when the component is initialized.
 * Can be disabled by setting enabled: false
 */
AFRAME.registerComponent('ar-entities-spawner', {
    schema: {
        enabled: { type: 'boolean', default: true }
    },

    init: function () {
        if (!this.data.enabled) {
            console.log('[ar-entities-spawner] Disabled, not spawning AR entities');
            return;
        }

        console.log('[ar-entities-spawner] Spawning AR entities');
        this.spawnAREntities();
    },

    spawnAREntities: function () {
        const container = this.el;

        // AR Ambient Light
        const ambientLight = document.createElement('a-entity');
        ambientLight.setAttribute('id', 'ar-ambient-light');
        ambientLight.setAttribute('light', 'type: ambient; color: #ffffff; intensity: 0.5');
        ambientLight.setAttribute('hide-on-enter-vr', '');
        container.appendChild(ambientLight);

        // AR Ground Plane for Physics
        const groundPlane = document.createElement('a-plane');
        groundPlane.setAttribute('id', 'ar-ground-plane');
        groundPlane.setAttribute('position', '0 0 0');
        groundPlane.setAttribute('rotation', '-90 0 0');
        groundPlane.setAttribute('width', '20');
        groundPlane.setAttribute('height', '20');
        groundPlane.setAttribute('visible', 'false');
        groundPlane.setAttribute('ammo-body', 'type: static');
        groundPlane.setAttribute('ammo-shape', 'type: box');
        groundPlane.setAttribute('hide-on-enter-vr', '');
        container.appendChild(groundPlane);

        // AR Computer
        const arComputer = document.createElement('a-entity');
        arComputer.setAttribute('id', 'ar-computer-entity');
        arComputer.setAttribute('gltf-model', '#computer');
        arComputer.setAttribute('position', '-15 3 -20');
        arComputer.setAttribute('scale', '1 1 1');
        arComputer.setAttribute('rotation', '0 0 0');
        arComputer.setAttribute('visible', 'true');
        arComputer.setAttribute('hide-on-enter-vr', '');
        arComputer.setAttribute('look-at-camera', 'enabled: true; manualCamera: #head');
        arComputer.setAttribute('animation', 'property: position; to: -15 3.5 -20; loop: true; dir: alternate; dur: 2000; easing: easeInOutQuad');

        // Computer screen plane (black background)
        const screenPlane = document.createElement('a-plane');
        screenPlane.setAttribute('position', '0 4.5 2.23');
        screenPlane.setAttribute('height', '3');
        screenPlane.setAttribute('width', '4.8');
        screenPlane.setAttribute('color', 'black');
        screenPlane.setAttribute('ammo-body', 'type: static');
        screenPlane.setAttribute('ammo-shape', 'type: box');
        arComputer.appendChild(screenPlane);

        // Computer UI plane (ChatGPT logo)
        const uiPlane = document.createElement('a-plane');
        uiPlane.setAttribute('src', '#chatgptscreenshot');
        uiPlane.setAttribute('position', '0 4.5 2.29');
        uiPlane.setAttribute('height', '2.5');
        uiPlane.setAttribute('width', '2.5');
        uiPlane.setAttribute('material', 'transparent: true; alphaTest: 0.5');
        uiPlane.setAttribute('animation', 'property: rotation; to: 0 0 -360; loop: true; dur: 5000; easing: easeInOutCubic');
        uiPlane.setAttribute('ammo-body', 'type: static');
        uiPlane.setAttribute('ammo-shape', 'type: box');
        arComputer.appendChild(uiPlane);

        // Computer light
        const computerLight = document.createElement('a-entity');
        computerLight.setAttribute('id', 'ar-computer-light');
        computerLight.setAttribute('position', '0 4.726 2.727');
        computerLight.setAttribute('light', 'type: point; color: #ffffff; distance: 2; decay: 1; intensity: 3');
        arComputer.appendChild(computerLight);

        container.appendChild(arComputer);

        // AR Generator Area (empty container)
        const emptyGenerator = document.createElement('a-entity');
        emptyGenerator.setAttribute('id', 'ar-emptyGenerator-entity');
        emptyGenerator.setAttribute('position', '0 0 2');
        emptyGenerator.setAttribute('rotation', '0 180 0');
        emptyGenerator.setAttribute('hide-on-enter-vr', '');

        // Diesel Generator
        const dieselGenerator = document.createElement('a-entity');
        dieselGenerator.setAttribute('id', 'ar-diesel-generator-entity');
        dieselGenerator.setAttribute('gltf-model', '#diesel-generator');
        dieselGenerator.setAttribute('position', '-0.441 0 -0.585');
        dieselGenerator.setAttribute('rotation', '0 -90 0');
        dieselGenerator.setAttribute('scale', '2 2 2');
        dieselGenerator.setAttribute('visible', 'true');
        emptyGenerator.appendChild(dieselGenerator);

        // Socket
        const socket = document.createElement('a-entity');
        socket.setAttribute('id', 'ar-socket-entity');
        socket.setAttribute('gltf-model', '#socket');
        socket.setAttribute('position', '-0.056 0.873 0.047');
        socket.setAttribute('rotation', '0 -90 0');
        socket.setAttribute('visible', 'true');
        emptyGenerator.appendChild(socket);

        container.appendChild(emptyGenerator);

        // AR Plug (direct child of container for physics sync)
        const plug = document.createElement('a-entity');
        plug.setAttribute('id', 'ar-plug-entity');
        plug.setAttribute('gltf-model', '#antenna-plug');
        plug.setAttribute('position', '0.056 1.028 2.05');
        plug.setAttribute('rotation', '0 0 180');
        plug.setAttribute('scale', '0.27 0.27 0.27');
        plug.setAttribute('visible', 'true');
        plug.setAttribute('ammo-body', 'type: dynamic; gravity: 0 0 0');
        plug.setAttribute('ammo-shape', 'type: hull');
        plug.setAttribute('grabbable-custom', 'changeEntityPhysicsToDynamic: true; isPlug: true');
        plug.setAttribute('hide-on-enter-vr', '');
        container.appendChild(plug);

        // AR Terminal
        const arTerminal = document.createElement('a-entity');
        arTerminal.setAttribute('id', 'ar-terminal');
        arTerminal.setAttribute('visible', 'true');
        arTerminal.setAttribute('hide-on-enter-vr', '');

        // Lowpoly Altar
        const lowpolyAltar = document.createElement('a-entity');
        lowpolyAltar.setAttribute('id', 'ar-lowpoly-altar-entity');
        lowpolyAltar.setAttribute('gltf-model', '#lowpoly-altar');
        lowpolyAltar.setAttribute('position', '0 0 -2');
        lowpolyAltar.setAttribute('scale', '1 1 1');
        lowpolyAltar.setAttribute('rotation', '0 0 0');
        lowpolyAltar.setAttribute('ammo-body', 'type: static');
        lowpolyAltar.setAttribute('ammo-shape', 'type: hull');
        lowpolyAltar.setAttribute('visible', 'true');
        arTerminal.appendChild(lowpolyAltar);

        // Old Paper
        const oldPaper = document.createElement('a-entity');
        oldPaper.setAttribute('id', 'ar-old-paper-entity');
        oldPaper.setAttribute('gltf-model', '#old-paper');
        oldPaper.setAttribute('position', '0 1.347 -2');
        oldPaper.setAttribute('rotation', '0 90 23.807');
        oldPaper.setAttribute('scale', '0.6 1 0.6');
        oldPaper.setAttribute('visible', 'true');
        oldPaper.setAttribute('glide-upwards', 'enabled: true; speed: 0.1; heightOffset: 0.3;');
        oldPaper.setAttribute('ammo-body', 'type: static');
        oldPaper.setAttribute('ammo-shape', 'type: hull');

        // Chat greeting text
        const chatGreeting = document.createElement('a-text');
        chatGreeting.setAttribute('id', 'ar-chat-greeting');
        chatGreeting.setAttribute('value', 'Wie kann ich dir heute helfen, die Welt zu verbessern?');
        chatGreeting.setAttribute('position', '0.08 0.11 -0.97');
        chatGreeting.setAttribute('rotation', '-90 -90 0');
        chatGreeting.setAttribute('width', '2');
        chatGreeting.setAttribute('wrap-count', '46');
        chatGreeting.setAttribute('color', 'black');
        chatGreeting.setAttribute('ammo-body', 'type: static');
        chatGreeting.setAttribute('ammo-shape', 'type: box');
        oldPaper.appendChild(chatGreeting);

        // Chat UI plane
        const chatUI = document.createElement('a-plane');
        chatUI.setAttribute('id', 'ar-chat-ui');
        chatUI.setAttribute('src', '#chatgptuielements');
        chatUI.setAttribute('position', '0 0.1 0');
        chatUI.setAttribute('rotation', '-90 -90 0');
        chatUI.setAttribute('height', '0.63');
        chatUI.setAttribute('width', '2.92');
        chatUI.setAttribute('material', 'transparent: true; alphaTest: 0.5');
        chatUI.setAttribute('blink-cursor', 'non_cursor_src: #chatgptuielements; cursor_src: #chatgptuielementswithcursor');
        chatUI.setAttribute('ammo-body', 'type: static');
        chatUI.setAttribute('ammo-shape', 'type: box');
        chatUI.setAttribute('class', 'clickable');
        chatUI.setAttribute('chat-interaction', 'textEntity: #ar-chat-greeting;');
        oldPaper.appendChild(chatUI);

        // Terminal light
        const terminalLight = document.createElement('a-entity');
        terminalLight.setAttribute('id', 'ar-terminal-light');
        terminalLight.setAttribute('position', '0 1 0');
        terminalLight.setAttribute('light', 'type: point; color: #ffb357; distance: 2; decay: 1');
        oldPaper.appendChild(terminalLight);

        arTerminal.appendChild(oldPaper);
        container.appendChild(arTerminal);

        console.log('[ar-entities-spawner] AR entities spawned successfully');
    }
});
