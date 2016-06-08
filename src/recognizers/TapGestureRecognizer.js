const GestureRecognizer = require('./../GestureRecognizer');
const GestureState = require('./../GestureState');

class TapGestureRecognizer extends GestureRecognizer {
  constructor({ numberOfTapsRequired = 1 }) {
    super();
    this.numberOfTapsRequired = numberOfTapsRequired;
  }

  getTapCount(touch) {
    return 1; // TODO(lmr):
  }

  touchesBegan(touches, event) {
    const touch = touches[0];
    const tapCount = this.getTapCount(touch);
    if (tapCount >= this.numberOfTapsRequired) {
      if (this.state == GestureState.POSSIBLE) {
        this.state = GestureState.BEGAN;
      } else if (this.state == GestureState.BEGAN) {
        this.state = GestureState.CHANGED;
      }
    }
  }

  touchesMoved(touches, event) {
    if (this.state === GestureState.BEGAN || this.state === GestureState.CHANGED) {
      this.state = GestureState.CANCELED;
    }
  }

  touchesEnded(touches, event) {
    if (this.state === GestureState.BEGAN || this.state === GestureState.CHANGED) {
      this.state = GestureState.ENDED;
    }
  }

  touchesCanceled(touches, event) {
    if (this.state === GestureState.BEGAN || this.state === GestureState.CHANGED) {
      this.state = GestureState.CANCELED;
    }
  }

}

module.exports = TapGestureRecognizer;
