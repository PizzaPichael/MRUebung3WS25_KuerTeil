AFRAME.registerComponent('blink-cursor', {
  schema: {
    non_cursor_src: { type: 'string', default: '' },
    cursor_src: { type: 'string', default: ''}
  },
  init: function() {
    this.waitTime = 500; // 1 Sekunde
    this.elapsed = 0;
    this.cursorOn = false;
    this.isActive = true;
    
    if(this.data.non_cursor_src === '' || this.data.cursor_src === '') {
      this.isActive = false;
      console.warn('blink-cursor: src attributes not provided');
    }
  },
  tick: function(time, deltaTime) {
    if (!this.isActive) return; // Hier prüfen!
    
    this.elapsed += deltaTime;
    if (this.elapsed >= this.waitTime) {
        if(!this.cursorOn) {
            this.el.setAttribute('src', this.data.cursor_src);
            this.cursorOn = true;
        } else {
            this.el.setAttribute('src', this.data.non_cursor_src);
            this.cursorOn = false;
        }
        this.elapsed = 0; // Timer zurücksetzen
    }
  }

});