/**
 * Basic event emitter implementation.
 *
 * Currently every GestureRecognizer will inherit from this class in order to emit
 * events such as `action`. Also, potentially, in order to implement the equivalent of the
 * UIGestureRecognizerDelegate semantics.
 */
class EventEmitter {
  constructor() {
    this._registry = {};
  }

  emit(event, ...args) {
    const callbacks = this._registry[event];
    if (!callbacks) return;
    callbacks.forEach(cb => cb.apply(this, args))
  }

  on(event, callback) {
    if (!this._registry[event]) {
      this._registry[event] = [];
    }
    this._registry[event].push(callback);
  }

  off(event, callback) {
    const callbacks = this._registry[event];
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // anyReturnTrue(event, returnIfNone, ...args) {
  //   const callbacks = this._registry[event];
  //   if (!callbacks) return returnIfNone;
  //   return callbacks.some(cb => cb.apply(this, args))
  // }
}

module.exports = EventEmitter;
