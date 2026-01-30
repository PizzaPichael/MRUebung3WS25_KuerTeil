/*
* This compoenent enables an entity to spiral up and down in a helix pattern.
*/
AFRAME.registerComponent('spiral-movement', {
    schema: {
        originPosition: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
        spiralRadius: { type: 'number', default: 1 },
        spiralHeight: { type: 'number', default: 5 },
        spiralPitch: { type: 'number', default: 1 },
        spiralAxis: { type: 'string', default: 'y' },
        spinClockwise: { type: 'boolean', default: true },
        speed: { type: 'number', default: 1 },
        enabled: { type: 'boolean', default: true },
    },

    /*
    * Initializes spiral parameters and the origin position.
    * If no position is given as a parameter, the objects position is used as origin position.
    */
    init: function () {
        if (
            this.data.originPosition.x === 0 &&
            this.data.originPosition.y === 0 &&
            this.data.originPosition.z === 0
        ) {
            this.data.originPosition = {
                x: this.el.object3D.position.x,
                y: this.el.object3D.position.y,
                z: this.el.object3D.position.z,
            };

        } else {
            this.el.object3D.position.set(
                this.data.originPosition.x,
                this.data.originPosition.y,
                this.data.originPosition.z
            );
        }

        this.elapsed = 0; // Time variable

        this.h = this.data.spiralPitch;     // Helix pitch
        this.maxZ = this.data.spiralHeight; // Maximum z value the helix should have
        this.maxT = this.maxZ / this.h;     // Maximum t/time value that is calculated by the above variables
        this.direction = 1;
        this.angle = 0; // Angle the entity spirals on. Can be thought of as the angle of a circle around the origin position
    },

    /*
    * Updates the entity position along a helix each frame.
    */
    tick: function (time, deltaTime) {
        if (!this.data.enabled) return;

        const angleSpeed = (deltaTime / 1000) * this.data.speed; // Computes how fast the turn angle should advance each frame/tick
        this.angle += angleSpeed * (this.data.spinClockwise ? 1 : -1);
        this.elapsed += angleSpeed * this.direction;

        if (this.elapsed >= this.maxT) {
            // If the elapsed time has reached the time that the helix is at its peak, determined by spiral height and pitch,
            // the spiral animations switches turn direction and counts down elapsed isntead of increasing it.
            this.elapsed = this.maxT;
            this.direction = -1;
        } else if (this.elapsed <= 0) {
            // If the starting value of 0 is surpassed, the animation switches direction back up
            this.elapsed = 0;
            this.direction = 1;
        }

        let x = 0;
        let y = 0;
        let z = 0;

        /*
        Helix formulas:
        x(t) =r⋅cos(t)
        y(t) =r⋅sin(t)
        z(t) =h⋅t
        */
       // Depending on the axis to spiral around, the axis are calculated accordingly
        if (this.data.spiralAxis === 'x') {
            z =
                this.data.originPosition.z +
                this.data.spiralRadius * Math.cos(this.angle);
            y =
                this.data.originPosition.y +
                this.data.spiralRadius * Math.sin(this.angle);
            x = this.data.originPosition.x + this.h * this.elapsed;
        } else if (this.data.spiralAxis === 'y') {
            x =
                this.data.originPosition.x +
                this.data.spiralRadius * Math.cos(this.angle);
            z =
                this.data.originPosition.z +
                this.data.spiralRadius * Math.sin(this.angle);
            y = this.data.originPosition.y + this.h * this.elapsed;
        } else if (this.data.spiralAxis === 'z') {
            x =
                this.data.originPosition.x +
                this.data.spiralRadius * Math.cos(this.elapsed * this.angle);
            y =
                this.data.originPosition.y +
                this.data.spiralRadius * Math.sin(this.elapsed * this.angle);
            z = this.data.originPosition.z + this.h * this.elapsed;
        }

        this.el.object3D.position.set(x, y, z);
    },
});
