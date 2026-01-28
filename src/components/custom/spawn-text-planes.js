/* 
This component spawns Text-Plane entities with the desired spiral movement.
The planes look at the socket-entity in the scene while the player has not reached
the proximityPlaneStopIdleFocus proximity plane yet.
When reached, the palnes look at the player.
When reaching the proximityPlaneStopSpiral plane the planes stop spiraling and just look at the player
from the position they were last in.

Is used on an empty entity inside the scene.
*/
AFRAME.registerComponent('spawn-text-planes', {
    schema: {
        texts: { type: 'array', default: [] },
        proximityPlaneStopIdleFocus: { type: 'string', default: '' },
        proximityPlaneStopSpiral: { type: 'string', default: '' },
        noIdle: { type: 'boolean', default: false },
        overWriteStartPos: { type: 'string', default: '' }
    },

    init: function () {
        this.data.texts.forEach((text, index) => {
            const plane = document.createElement('a-plane');
            const id = 'text-plane-' + index;
            plane.setAttribute('id', id);
            plane.setAttribute('side', 'double');
            plane.setAttribute('height', '2.5');
            plane.setAttribute('width', '2.5');
            plane.setAttribute('color', 'pink');
            plane.setAttribute('position', this.calculatePosition(index));
            plane.setAttribute('look-at-camera', {
                enabled: true
            });
            if(this.data.overWriteStartPos === '') {
                plane.setAttribute('spiral-movement', {
                    originPosition: '-0.056 0.873 -140.916',
                    spiralRadius: this.randomValue(2.9, 6.8),
                    spiralHeight: this.randomValue(4.2, 14.4),
                    spiralPitch: this.randomValue(0.2, 2),
                    speed: this.randomValue(0.5, 2)
                });
            } else {
                plane.setAttribute('spiral-movement', {
                    originPosition: this.data.overWriteStartPos,
                    spiralRadius: this.randomValue(2.9, 6.8),
                    spiralHeight: this.randomValue(4.2, 14.4),
                    spiralPitch: this.randomValue(0.2, 2),
                    speed: this.randomValue(0.5, 2)
                });
            }
            
            // Every second plane spinns in counterclockwise direction
            let rest = index % 2;
            if (rest === 1) {
                plane.setAttribute('spiral-movement', { spinClockwise: false });
            }

            if(!this.data.noIdle && this.data.proximityPlaneStopIdleFocus != '' && this.data.proximityPlaneStopSpiral != '') {
                plane.setAttribute('look-at-camera', {
                    enabled: false,
                    idleEntityId: '#socket-entity'
                });
                plane.setAttribute('proximity-circle', {
                    changes: [
                        {
                            target: this.data.proximityPlaneStopIdleFocus,
                            component: 'look-at-camera',
                            attribute: 'enabled',
                            value: true
                        },
                        {
                            target: this.data.proximityPlaneStopSpiral,
                            component: 'spiral-movement',
                            attribute: 'enabled',
                            value: false
                        }
                    ]
    
                });
            } 
            
            plane.setAttribute('on-event-deactivate-components',{
                event: 'plug-grabbed',
                target: '#plug-entity', 
                components: 'spiral-movement, proximity-circle'
            });         

            const textEl = document.createElement('a-text');
            textEl.setAttribute('value', text);
            textEl.setAttribute('color', 'black');
            textEl.setAttribute('align', 'center');
            textEl.setAttribute('wrap-count', 15);
            textEl.setAttribute('width', 3);
            plane.appendChild(textEl);

            this.el.appendChild(plane);
        });
    },

    /*
    Calculates a grid position for each text plane based on its index so that they dont spawn at the same place.
    Uses a 3-column layout and offsets the grid.
    Z is fixed so all planes spawn on the same depth and has been found by testing.
    */
    calculatePosition: function (index) {
        const row = Math.floor(index / 3);
        const col = index % 3;
        if(this.data.overWriteStartPos === '') {
            return `${col * 3 - 3} ${row * 3 + 2} -136`;
        } else {
            const parts = this.data.overWriteStartPos.split(' ');
            const zValue = parts.length >= 3 ? parts[2] : '-136';
            return `${col * 3 - 3} ${row * 3 + 2} ${zValue}`;
        }
    },

    randomValue: function (min, max) {
        return min + Math.random() * (max - min);
    }
});