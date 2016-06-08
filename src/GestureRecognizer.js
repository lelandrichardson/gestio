const invariant = require('invariant');
const {
  POSSIBLE,
  BEGAN,
  CHANGED,
  RECOGNIZED,
  ENDED,
  FAILED,
  CANCELED,
} = require('./GestureState');
const GestureRegistry = require('./GestureRegistry');
const EventEmitter = require('./EventEmitter');

/**
 * The GestureRecognizer base class.
 */
class GestureRecognizer extends EventEmitter {
  constructor(){
    super();
    // TODO(lmr):
    // I haven't added in any handling for these properties yet, but putting them
    // in here as a reminder!
    this.cancelsTouchesInView = true;
    this.delaysTouchesEnded = false;
    this.delaysTouchesBegan = false;

    // TODO(lmr): I haven't yet added logic to treat enabled/disabled differently.
    this.enabled = true;

    // NOTE(lmr):
    // Right now `.view` is a normal property of the recognizer, but we want to prevent
    // people from getting/setting it directly (rather than using `attachToView`).
    this.view = null;

    // this is the recognizer's current state. People should not access this directly, and instead
    // get/set through `this.state`.
    this._state = POSSIBLE;

    // an array of gesture recognizers that this recognizer requires to fail in order to recognize.
    this._requiredToFail = [];
  }

  get state() { return this._state; }
  set state(nextState) {
    console.log("setState", this._state, nextState);
    const prevState = this._state;
    this._state = nextState;
    this.handleStateTransition(prevState, nextState);
  }

  handleStateTransition(prevState, nextState) {
    if (nextState <= RECOGNIZED) {
      // TODO(lmr): fire action on next tick
      this.emit('action'); // TODO(lmr): args?
    }
    if (nextState >= RECOGNIZED) {
      // if transitioning into an ended/failed/canceled state, we want to reset on next tick.
      this._resetNext();
    }
  }
  
  // Public non-overridable Methods
  // ==============================
  
  attachToView(view) {
    if (view === this.view) {
      return;
    }
    this.detach();
    this.view = view;
    if (this.view) {
      GestureRegistry.attachRecognizerToView(this, this.view);
    }
  }

  detach() {
    if (this.view) {
      GestureRegistry.detachRecognizerFromView(this, this.view);
      this.view = null;
    }
    this._state = POSSIBLE;
    this.reset();
  }
  
  ignoreTouch(touch, event) {
    // TODO(lmr):
  }

  locationInView(touch, view = this.view) {
    // TODO(lmr):
  }
  
  // "Delegate" Callback Registration
  // ==============================

  registerGestureRecognizerShouldBeginCallback(callback) {
    // TODO(lmr):
    this.on('shouldBegin', callback);
  }

  registerShouldRequireFailureOfGestureRecognizerCallback(callback) {
    // TODO(lmr):
    this.on('shouldRequireFailureOfGestureRecognizer', callback);
  }
  
  registerShouldBeRequiredToFailByGestureRecognizerCallback(callback) {
    // TODO(lmr):
    this.on('shouldBeRequiredToFailByGestureRecognizer', callback);
  }
  
  registerShouldReceiveTouchCallback(callback) {
    // TODO(lmr):
    this.on('shouldReceiveTouch', callback);
  }
  
  registerShouldRecognizeSimultaneouslyWithGestureRecognizerCallback(callback) {
    // TODO(lmr):
    this.on('shouldRecognizeSimultaneouslyWithGestureRecognizer', callback);
  }
  
  registerActionCallback(callback) {
    this.on('action', callback);
  }
  
  requireGestureRecognizerToFail(recognizer) {
    invariant(this !== recognizer, 'Cannot have a gesture recognizer require itself to fail');
    this._requiredToFail.push(recognizer);
  }
  
  // Overridable Methods
  // ===================

  canRecognizeSimultaneouslyWithGestureRecognizer(recognizer) {
    // NOTE(lmr): in IOS, this is only ever a delegate method. I'm not sure what the
    // right approach is here. For now, I'm putting this as an overridable method.
    return false;
  }
  
  canPreventGestureRecognizer(recognizer) {
    return false;
  }
  
  canBePreventedByGestureRecognizer(recognizer) {
    return false;
  }
  
  shouldRequireFailureOfGestureRecognizer(recognizer) {
    return false;
  }
  
  shouldBeRequiredToFailByGestureRecognizer(recognizer) {
    return false;
  }
  
  touchesBegan(touches, event) {
    // OVERRRIDABLE (noop here)
  }
  
  touchesMoved(touches, event) {
    // OVERRRIDABLE (noop here)
  }
  
  touchesEnded(touches, event) {
    // OVERRRIDABLE (noop here)
  }
  
  touchesCanceled(touches, event) {
    // OVERRRIDABLE (noop here)
  }

  _resetNext() {
    // TODO(lmr):
    // I believe when the recognizer gets reset, it will go back to "possible", but I think we need to
    // do something to prevent sending more touch events to the recognizer from the same touches.
    setTimeout(() => {
      this._state = POSSIBLE;
      this.reset();
    }, 0);
  }
  
  reset() {
    // noop
  }
}

module.exports = GestureRecognizer;
