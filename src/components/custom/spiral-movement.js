AFRAME.registerComponent('spiral-movement', {
    schema: {
        originPosition: { type: 'vec3', default: '0 0 0' },
        spiralRadius: { type: 'number', default: 1 },
        spiralHeight: { type: 'number', default: 5 },
        spiralPitch: { type: 'number', default: 1 },
        spiralAxis: { type: 'string', default: 'y' },
        spinClockwise: { type: 'boolean', default: true },
        speed: { type: 'number', default: 1 },
        enabled: { type: 'boolean', default: true },
    },

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

        this.elapsed = 0;
        this.h = this.data.spiralPitch;
        this.maxZ = this.data.spiralHeight;
        this.maxT = this.maxZ / this.h;
        this.direction = 1;
        this.angle = 0;
    },

    tick: function (time, deltaTime) {
        if (!this.data.enabled) return;

        const angleSpeed = (deltaTime / 1000) * this.data.speed;
        this.angle += angleSpeed * (this.data.spinClockwise ? 1 : -1);
        this.elapsed += angleSpeed * this.direction;

        if (this.elapsed >= this.maxT) {
            this.elapsed = this.maxT;
            this.direction = -1;
        } else if (this.elapsed <= 0) {
            this.elapsed = 0;
            this.direction = 1;
        }

        let x = 0;
        let y = 0;
        let z = 0;
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
