import { GestureRecognizer, GestureState } from 'gestio';

function getTouchAngle(point) {
  // todo
  return 0;
}

export default class SwirlGestureRecognizer extends GestureRecognizer {

  constructor() {
    super();
    this.currentAngle = 0;
    this.previousAngle = 0;
  }

  touchesBegan(touches, event) {
    if (touches.length > 1) {
      this.state = GestureState.FAILED;
    }
  }

  touchesMoved(touches, event) {
    const touch = touches[0];

    // TODO(lmr): I'm not currently sure what the right "locationInView" API should be.
    this.currentAngle = getTouchAngle(touch.locationInView(touch.view));
    this.previousAngle = getTouchAngle(touch.locationInView(touch.view));

    this.state = GestureState.CHANGED;
  }

  touchesEnded(touches, event) {
    this.state = GestureState.ENDED;
  }

  touchesCanceled(touches, event) {
    this.state = GestureState.CANCELED;
  }
}
