// Source: https://c-frame.github.io/aframe-super-hands-component/examples/

AFRAME.registerComponent('phase-shift', {
    init: function () {
        var el = this.el
        el.addEventListener('gripdown', function () {
            el.setAttribute('collision-filter', { collisionForces: true })
        })
        el.addEventListener('gripup', function () {
            el.setAttribute('collision-filter', { collisionForces: false })
        })
    }
});