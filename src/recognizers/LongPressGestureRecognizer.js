const GestureRecognizer = require('./../GestureRecognizer');
const GestureState = require('./../GestureState');

function dist(a, b) {
  const dx = b.x - a.x; // TODO(lmr): screenX? pageX?
  const dy = b.y - a.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

class LongPressGestureRecognizer extends GestureRecognizer {
  constructor({ minimumPressDuration = 500, allowableMovement = 10 }) {
    super();
    this.minimumPressDuration = minimumPressDuration;
    this.allowableMovement = allowableMovement;
    this._waiting = false;
    this._beginLocation = null;
    this._timeoutId = null;
  }

  _beginGesture() {
    this._waiting = false;
    if (this.state === GestureState.POSSIBLE) {
      this.state = GestureState.BEGAN;
    }
  }

  _cancelWaiting() {
    if (this._waiting) {
      this._waiting = false;
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  touchesBegan(touches, event) {
    const touch = touches[0];
    if (!this._waiting && this.state === GestureState.POSSIBLE) {
      this._beginLocation = this.locationInView(touch);
      this._waiting = true;
      this._timeoutId = setTimeout(() => this._beginGesture(), this.minimumPressDuration);
    }
  }

  touchesMoved(touches, event) {
    if (this.state === GestureState.BEGAN || this.state === GestureState.CHANGED) {
      const touch = touches[0];
      const distance = dist(this.locationInView(touch), this._beginLocation);

      if (distance <= this.allowableMovement) {
        this.state = GestureState.CHANGED;
      } else {
        this.state = GestureState.CANCELED;
      }
    }
  }

  touchesEnded(touches, event) {
    if (this.state === GestureState.BEGAN || this.state === GestureState.CHANGED) {
      this.state = GestureState.ENDED;
    } else {
      this._cancelWaiting();
    }
  }

  touchesCanceled(touches, event) {
    if (this.state === GestureState.BEGAN || this.state === GestureState.CHANGED) {
      this.state = GestureState.CANCELED;
    } else {
      this._cancelWaiting();
    }
  }

  reset() {
    this._waiting = false;
    this._beginLocation = null;
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

}

module.exports = LongPressGestureRecognizer;
