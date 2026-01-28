/*
 * VR Entities Component
 * Spawns all VR-specific entities when the component is initialized.
 * Can be disabled by setting enabled: false
 */
AFRAME.registerComponent('vr-entities-spawner', {
    schema: {
        enabled: { type: 'boolean', default: true }
    },

    init: function () {
        if (!this.data.enabled) {
            console.log('[vr-entities-spawner] Disabled, not spawning VR entities');
            return;
        }

        console.log('[vr-entities-spawner] Spawning VR entities');
        this.spawnVREntities();
    },

    spawnVREntities: function () {
        const container = this.el;

        // Throneroom object
        const throneroom = document.createElement('a-entity');
        throneroom.setAttribute('id', 'throneroomentity');
        throneroom.setAttribute('gltf-model', '#throneroom');
        throneroom.setAttribute('position', '0 0 0');
        throneroom.setAttribute('scale', '4 4 4');
        throneroom.setAttribute('shadow', 'receive: true');
        throneroom.setAttribute('visible', 'true');
        throneroom.setAttribute('torchlight-spawner', '');
        container.appendChild(throneroom);

        // Throneroom interior
        const throneroomInterior = document.createElement('a-entity');
        throneroomInterior.setAttribute('id', 'throneroom-interior');
        throneroomInterior.setAttribute('hide-on-enter-ar', '');

        // Altar Area
        const altarArea = document.createElement('a-entity');
        altarArea.setAttribute('id', 'altar');
        altarArea.setAttribute('hide-on-enter-ar', '');

        // Stairs
        const stairs = document.createElement('a-entity');
        stairs.setAttribute('id', 'stairsentitiy');
        stairs.setAttribute('gltf-model', '#stairs');
        stairs.setAttribute('position', '0 -1.2 -40');
        stairs.setAttribute('scale', '0.6 0.6 0.6');
        stairs.setAttribute('rotation', '0 90 0');
        stairs.setAttribute('ammo-body', 'type: static');
        stairs.setAttribute('ammo-shape', 'type: hull; offset: 6 4.7 0');
        stairs.setAttribute('visible', 'true');
        altarArea.appendChild(stairs);

        // Altar
        const altar = document.createElement('a-entity');
        altar.setAttribute('id', 'altar-entitiy');
        altar.setAttribute('gltf-model', '#altar');
        altar.setAttribute('position', '0 6 -50');
        altar.setAttribute('visible', 'true');
        altar.setAttribute('scale', '0.03 0.03 0.03');
        altar.setAttribute('rotation', '0 0 0');
        altar.setAttribute('ammo-body', 'type: static');
        altar.setAttribute('ammo-shape', 'type: box; offset: 0 3.8 0');
        altarArea.appendChild(altar);

        throneroomInterior.appendChild(altarArea);

        // Interaktionsterminal
        const terminal = document.createElement('a-entity');
        terminal.setAttribute('id', 'terminal');
        terminal.setAttribute('visible', 'true');
        terminal.setAttribute('hide-on-enter-ar', '');

        // Lowpoly Altar
        const lowpolyAltar = document.createElement('a-entity');
        lowpolyAltar.setAttribute('id', 'lowpoly-altar-entitiy');
        lowpolyAltar.setAttribute('gltf-model', '#lowpoly-altar');
        lowpolyAltar.setAttribute('position', '0 0 -30');
        lowpolyAltar.setAttribute('scale', '1 1 1');
        lowpolyAltar.setAttribute('rotation', '0 0 0');
        lowpolyAltar.setAttribute('ammo-body', 'type: static');
        lowpolyAltar.setAttribute('ammo-shape', 'type: hull');
        lowpolyAltar.setAttribute('visible', 'true');
        terminal.appendChild(lowpolyAltar);

        // Old Paper with chat interaction
        const oldPaper = document.createElement('a-entity');
        oldPaper.setAttribute('id', 'old-paper-entitiy');
        oldPaper.setAttribute('gltf-model', '#old-paper');
        oldPaper.setAttribute('position', '0 1.347 -30');
        oldPaper.setAttribute('rotation', '0 90 23.807');
        oldPaper.setAttribute('scale', '0.6 1 0.6');
        oldPaper.setAttribute('visible', 'true');
        oldPaper.setAttribute('glide-upwards', 'enabled: false, speed: 0.01; heightOffset: 0.3;');
        oldPaper.setAttribute('proximity-circle', 'target: #paper-proximity-plane; componentToChange: glide-upwards; compAttrToChange: enabled; compAttrNewBoolValue: true');
        oldPaper.setAttribute('ammo-body', 'type: static');
        oldPaper.setAttribute('ammo-shape', 'type: hull');

        // Chat greeting text
        const chatGreeting = document.createElement('a-text');
        chatGreeting.setAttribute('id', 'chat-greeting');
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
        chatUI.setAttribute('id', 'chat-ui');
        chatUI.setAttribute('src', '#chatgptuielements');
        chatUI.setAttribute('position', '0 0.1 0');
        chatUI.setAttribute('rotation', '-90 -90 0');
        chatUI.setAttribute('height', '0.63');
        chatUI.setAttribute('width', '2.92');
        chatUI.setAttribute('material', 'transparent: true; alphaTest: 0.5');
        chatUI.setAttribute('blink-cursor', 'non_cursor_src: #chatgptuielements; cursor_src: #chatgptuielementswithcursor');
        chatUI.setAttribute('ammo-body', 'type: static');
        chatUI.setAttribute('ammo-shape', 'type: box');
        chatUI.setAttribute('chat-interaction', 'textEntity: #chat-greeting;');
        oldPaper.appendChild(chatUI);

        // Terminal light
        const terminalLight = document.createElement('a-entity');
        terminalLight.setAttribute('id', 'termnial-light');
        terminalLight.setAttribute('position', '0 1 0');
        terminalLight.setAttribute('light', 'type: point; color: #ffb357; distance: 2; decay: 1');
        oldPaper.appendChild(terminalLight);

        terminal.appendChild(oldPaper);

        // Paper proximity plane
        const paperProximity = document.createElement('a-circle');
        paperProximity.setAttribute('id', 'paper-proximity-plane');
        paperProximity.setAttribute('position', '0 0.03 -30');
        paperProximity.setAttribute('rotation', '-90 0 0');
        paperProximity.setAttribute('radius', '5');
        paperProximity.setAttribute('color', 'black');
        paperProximity.setAttribute('transparent', 'true');
        paperProximity.setAttribute('opacity', '0');
        paperProximity.setAttribute('ammo-body', 'type: static');
        paperProximity.setAttribute('ammo-shape', 'type: box');
        terminal.appendChild(paperProximity);

        throneroomInterior.appendChild(terminal);

        // Altar curtains
        const altarCurtains = document.createElement('a-entity');
        altarCurtains.setAttribute('id', 'altar-curtains');
        altarCurtains.setAttribute('visible', 'true');
        altarCurtains.setAttribute('hide-on-enter-ar', '');

        const whiteCurtain = document.createElement('a-entity');
        whiteCurtain.setAttribute('id', 'white-curtain-entity');
        whiteCurtain.setAttribute('gltf-model', '#white-curtain');
        whiteCurtain.setAttribute('position', '1 0 -59');
        whiteCurtain.setAttribute('rotation', '0 0 0');
        whiteCurtain.setAttribute('scale', '0.15 0.3 0.2');
        whiteCurtain.setAttribute('ammo-body', 'type: static');
        whiteCurtain.setAttribute('ammo-shape', 'type: hull');
        whiteCurtain.setAttribute('visible', 'true');
        altarCurtains.appendChild(whiteCurtain);

        const victorianCurtain1 = document.createElement('a-entity');
        victorianCurtain1.setAttribute('id', 'victorian-curtain-entity');
        victorianCurtain1.setAttribute('gltf-model', '#victorian-curtain');
        victorianCurtain1.setAttribute('position', '9 16 -57');
        victorianCurtain1.setAttribute('rotation', '0 0 0');
        victorianCurtain1.setAttribute('scale', '4 8 10');
        victorianCurtain1.setAttribute('ammo-body', 'type: static');
        victorianCurtain1.setAttribute('ammo-shape', 'type: hull');
        victorianCurtain1.setAttribute('visible', 'true');
        altarCurtains.appendChild(victorianCurtain1);

        const victorianCurtain2 = document.createElement('a-entity');
        victorianCurtain2.setAttribute('id', 'victorian-curtain-entity-two');
        victorianCurtain2.setAttribute('gltf-model', '#victorian-curtain');
        victorianCurtain2.setAttribute('position', '-9 16 -57');
        victorianCurtain2.setAttribute('rotation', '0 -180 0');
        victorianCurtain2.setAttribute('scale', '4 8 10');
        victorianCurtain2.setAttribute('ammo-body', 'type: static');
        victorianCurtain2.setAttribute('ammo-shape', 'type: hull');
        victorianCurtain2.setAttribute('visible', 'true');
        altarCurtains.appendChild(victorianCurtain2);

        throneroomInterior.appendChild(altarCurtains);

        // Computer
        const computerContainer = document.createElement('a-entity');
        computerContainer.setAttribute('id', 'computer');
        computerContainer.setAttribute('visible', 'true');
        computerContainer.setAttribute('hide-on-enter-ar', '');

        const computerEntity = document.createElement('a-entity');
        computerEntity.setAttribute('id', 'computer-entitiy');
        computerEntity.setAttribute('gltf-model', '#computer');
        computerEntity.setAttribute('position', '0 15 -50');
        computerEntity.setAttribute('scale', '1 1 1');
        computerEntity.setAttribute('rotation', '0 0 0');
        computerEntity.setAttribute('visible', 'true');
        computerEntity.setAttribute('look-at-camera', 'enabled: false');
        computerEntity.setAttribute('animation', 'property: position; to: 0 15.5 -50; loop: true; dir: alternate; dur: 2000; easing: easeInOutQuad');
        computerEntity.setAttribute('proximity-circle', 'target: #computer-proximity-plane; componentToChange: look-at-camera; compAttrToChange: enabled; compAttrNewBoolValue: true');
        computerEntity.setAttribute('on-event-deactivate-components', 'event: plug-grabbed; target: #plug-entity; components: proximity-circle, animation, look-at-camera');
        computerEntity.setAttribute('on-event-teleport', 'event: plug-grabbed; target: #plug-entity; position: 0 6.702 -40.813; rotation: 70.961 -176.460 -154.704');

        const compScreenPlane = document.createElement('a-plane');
        compScreenPlane.setAttribute('position', '0 4.5 2.23');
        compScreenPlane.setAttribute('height', '3');
        compScreenPlane.setAttribute('width', '4.8');
        compScreenPlane.setAttribute('color', 'black');
        compScreenPlane.setAttribute('ammo-body', 'type: static');
        compScreenPlane.setAttribute('ammo-shape', 'type: box');
        computerEntity.appendChild(compScreenPlane);

        const compUIPlane = document.createElement('a-plane');
        compUIPlane.setAttribute('src', '#chatgptscreenshot');
        compUIPlane.setAttribute('position', '0 4.5 2.29');
        compUIPlane.setAttribute('height', '2.5');
        compUIPlane.setAttribute('width', '2.5');
        compUIPlane.setAttribute('material', 'transparent: true; alphaTest: 0.5');
        compUIPlane.setAttribute('animation', 'property: rotation; to: 0 0 -360; loop: true; dur: 5000; easing: easeInOutCubic');
        compUIPlane.setAttribute('ammo-body', 'type: static');
        compUIPlane.setAttribute('ammo-shape', 'type: box');
        computerEntity.appendChild(compUIPlane);

        const compLight = document.createElement('a-entity');
        compLight.setAttribute('id', 'computer-light');
        compLight.setAttribute('position', '0 4.726 2.727');
        compLight.setAttribute('light', 'type: point; color: #ffffff; distance: 2; decay: 1; intensity: 3');
        computerEntity.appendChild(compLight);

        computerContainer.appendChild(computerEntity);

        const computerProximity = document.createElement('a-circle');
        computerProximity.setAttribute('id', 'computer-proximity-plane');
        computerProximity.setAttribute('position', '0 0.03 -25');
        computerProximity.setAttribute('rotation', '-90 0 0');
        computerProximity.setAttribute('radius', '40');
        computerProximity.setAttribute('color', 'black');
        computerProximity.setAttribute('transparent', 'true');
        computerProximity.setAttribute('opacity', '0');
        computerProximity.setAttribute('ammo-body', 'type: static');
        computerProximity.setAttribute('ammo-shape', 'type: box');
        computerContainer.appendChild(computerProximity);

        throneroomInterior.appendChild(computerContainer);
        container.appendChild(throneroomInterior);

        // Blackbox room
        const blackbox = document.createElement('a-entity');
        blackbox.setAttribute('id', 'blackbox');
        blackbox.setAttribute('hide-on-enter-ar', '');

        // Blackbox light
        const blackboxLight = document.createElement('a-entity');
        blackboxLight.setAttribute('id', 'blackbox-light');
        blackboxLight.setAttribute('position', '0 11.992 -121');
        blackboxLight.setAttribute('rotation', '-30 0 0');
        blackboxLight.setAttribute('light', 'type: spot; color: #ffffff; distance: 50; angle: 20; decay: 1; intensity: 10; castShadow: true; target: generator-entity');
        blackbox.appendChild(blackboxLight);

        // Generator
        const generator = document.createElement('a-entity');
        generator.setAttribute('id', 'generator-entity');
        generator.setAttribute('gltf-model', '#generator');
        generator.setAttribute('position', '-0.7 0 -144.3');
        generator.setAttribute('ammo-body', 'type: static');
        generator.setAttribute('ammo-shape', 'type: hull');
        generator.setAttribute('visible', 'true');
        blackbox.appendChild(generator);

        // Socket
        const socket = document.createElement('a-entity');
        socket.setAttribute('id', 'socket-entity');
        socket.setAttribute('gltf-model', '#socket');
        socket.setAttribute('position', '-0.056 0.873 -140.916');
        socket.setAttribute('rotation', '0 -90 0');
        socket.setAttribute('visible', 'true');
        blackbox.appendChild(socket);

        // Plug
        const plug = document.createElement('a-entity');
        plug.setAttribute('id', 'plug-entity');
        plug.setAttribute('gltf-model', '#antenna-plug');
        plug.setAttribute('position', '-0.056 1.028 -141.05');
        plug.setAttribute('rotation', '0 180 180');
        plug.setAttribute('scale', '0.27 0.27 0.27');
        plug.setAttribute('visible', 'true');
        plug.setAttribute('ammo-body', 'type: dynamic; gravity: 0 0 0');
        plug.setAttribute('ammo-shape', 'type: hull');
        plug.setAttribute('grabbable-custom', 'changeEntityPhysicsToDynamic: true; isPlug: true');
        blackbox.appendChild(plug);

        // Diesel Generator
        const dieselGen = document.createElement('a-entity');
        dieselGen.setAttribute('id', 'diesel-generator-entity');
        dieselGen.setAttribute('gltf-model', '#diesel-generator');
        dieselGen.setAttribute('position', '-0.441 0 -141.585');
        dieselGen.setAttribute('rotation', '0 -90 0');
        dieselGen.setAttribute('scale', '2 2 2');
        dieselGen.setAttribute('visible', 'true');
        blackbox.appendChild(dieselGen);

        // Dynamic test box
        const testBox = document.createElement('a-box');
        testBox.setAttribute('id', 'dynamic-test');
        testBox.setAttribute('position', '-0 3 -121.585');
        testBox.setAttribute('width', '1');
        testBox.setAttribute('height', '1');
        testBox.setAttribute('depth', '1');
        testBox.setAttribute('ammo-body', 'type: dynamic');
        testBox.setAttribute('ammo-shape', 'type: box');
        testBox.setAttribute('grabbable-custom', '');
        blackbox.appendChild(testBox);

        // Room proximity plane
        const roomProximity = document.createElement('a-circle');
        roomProximity.setAttribute('id', 'room-proximity-plane');
        roomProximity.setAttribute('position', '-0.441 0.09 -141.585');
        roomProximity.setAttribute('rotation', '-90 0 0');
        roomProximity.setAttribute('radius', '22');
        roomProximity.setAttribute('color', 'red');
        roomProximity.setAttribute('transparent', 'true');
        roomProximity.setAttribute('opacity', '0');
        blackbox.appendChild(roomProximity);

        // Generator proximity plane
        const genProximity = document.createElement('a-circle');
        genProximity.setAttribute('id', 'generator-proximity-plane');
        genProximity.setAttribute('position', '-0.441 0.1 -141.585');
        genProximity.setAttribute('rotation', '-90 0 0');
        genProximity.setAttribute('radius', '15');
        genProximity.setAttribute('color', 'black');
        genProximity.setAttribute('transparent', 'true');
        genProximity.setAttribute('opacity', '0');
        blackbox.appendChild(genProximity);

        // Fence
        const fence = document.createElement('a-entity');
        fence.setAttribute('id', 'fence-entity');
        fence.setAttribute('gltf-model', '#fence');
        fence.setAttribute('position', '-2.85 0 -119.5');
        fence.setAttribute('rotation', '0 90 0');
        fence.setAttribute('ammo-body', 'type: static');
        fence.setAttribute('ammo-shape', 'type: mesh');
        fence.setAttribute('visible', 'true');
        blackbox.appendChild(fence);

        // Chess floor
        const chessFloor = document.createElement('a-plane');
        chessFloor.setAttribute('src', '#chessfloor-diff');
        chessFloor.setAttribute('displacementMap', '#chessfloor-disp');
        chessFloor.setAttribute('displacementScale', '0.5');
        chessFloor.setAttribute('position', '0 0.01 -134.5');
        chessFloor.setAttribute('scale', '6 30 0');
        chessFloor.setAttribute('repeat', '3 15');
        chessFloor.setAttribute('rotation', '-90 0 0');
        chessFloor.setAttribute('ammo-body', 'type: static');
        chessFloor.setAttribute('ammo-shape', 'type: box');
        blackbox.appendChild(chessFloor);

        // Spawn text planes
        const textPlanesSpawner = document.createElement('a-entity');
        textPlanesSpawner.setAttribute('spawn-text-planes', 'texts: Missing transparency, Racial Profiling, Water scarcity, Discrimination, Distortion, Dominance of large tech companies, Desinformation, Rising temperatures, Light polution, Lazyness, Unfair; proximityPlaneStopIdleFocus: #room-proximity-plane; proximityPlaneStopSpiral: #generator-proximity-plane');
        blackbox.appendChild(textPlanesSpawner);

        container.appendChild(blackbox);

        console.log('[vr-entities-spawner] VR entities spawned successfully');
    }
});
