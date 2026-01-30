/*
* This component makes it so the Cursor on the Interaction Terminal ChatGPT UI appears blinking.
* It switches between displaying an image with a cursor and without a cursor. 
*/
AFRAME.registerComponent('blink-cursor', {
  schema: {
    non_cursor_src: { type: 'string', default: '' },
    cursor_src: { type: 'string', default: ''}
  },
  /*
  * Initializes blink state and validates required texture sources.
  */
  init: function() {
    this.waitTime = 500;
    this.elapsed = 0;
    this.cursorOn = false;
    this.isActive = true;
    
    if(this.data.non_cursor_src === '' || this.data.cursor_src === '') {
      this.isActive = false;
      console.warn('blink-cursor: src attributes not provided');
    }
  },

  /*
  * Toggles between cursor and non-cursor textures over time.
  * Switches image sources every few milliseconds
  */
  tick: function(time, deltaTime) {
    if (!this.isActive) return;
    this.elapsed += deltaTime;
    if (this.elapsed >= this.waitTime) {
        if(!this.cursorOn) {
            this.el.setAttribute('src', this.data.cursor_src);
            this.cursorOn = true;
        } else {
            this.el.setAttribute('src', this.data.non_cursor_src);
            this.cursorOn = false;
        }
        this.elapsed = 0;
    }
  }

});