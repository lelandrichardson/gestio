const {
  POSSIBLE,
  BEGAN,
  CHANGED,
  RECOGNIZED,
  ENDED,
  FAILED,
  CANCELED,
} = require('./GestureState');

class RecognizerManager {

  /**
   * This is where we have to decide which gesture recognizers will receive touches to analyze, and which ones won't,
   * based on their declared dependencies on other gesture recognizers through overridden methods etc.
   *
   * The logic get's kind of hairy, but this is the best approach I've found so far to do this, as it's quite involved.
   *
   * @param recognizers
   * @param callback
   */
  handleTouchEvent(recognizers, callback) {
    const queue = recognizers.slice(0);
    const sent = [];

    let current = queue.pop();

    main: while (current) {
      // if the recognizer is not enabled, we do not care about it
      if (!current.enabled) {
        current = queue.pop();
        continue;
      }

      // if the recognizer is done/failed/canceled, it doesn't need to analyze touches. In this case we just move on
      if (current.state >= RECOGNIZED) {
        current = queue.pop();
        continue;
      }

      // some gesture recognizers will be able to analyze touches at the same time as others. This is, however, the
      // exception, and in this case they will need to return true for the "canRecognizeSimultaneously" method. We
      // keep an array of the recognizers that have received touches thus far in this loop though and ensure that if
      // we are not in this situation, we end up expending the whole array quickly.
      if (sent.length > 0) {
        for (let i = 0; i < sent.length; i++) {
          const other = sent[i];
          if (!current.canRecognizeSimultaneouslyWithGestureRecognizer(other)) {
            current = queue.pop();
            continue main;
          }
        }
      }

      const requiredToFail = current._requiredToFail;

      for (let i = 0; i < requiredToFail.length; i++) {
        const other = requiredToFail[i];
        if (other.state <= RECOGNIZED) {
          // TODO(lmr): in this case, do we push current to the end of the queue? It seems possible that the other
          // gesture recognizer could get the touch event called on it, transition to failed, and then the current
          // gesture recognizer could end up getting touches passed to it as well. The problem with doing this, as
          // far as I can see, is that it might then become possible to end up in an endless loop.
          // queue.push(current);
          current = queue.pop();
          continue main;
        }
      }

      // check to see if any of the others recognizers are required to fail or be recognized
      for (let i = 0; i < queue.length; i++) {
        const other = queue[i];
        if (
          (other.canPreventGestureRecognizer(current) && other.state < RECOGNIZED) ||
          (current.canBePreventedByGestureRecognizer(other) && other.state < RECOGNIZED)
        ) {
          // swap current and other so that current  is in the queue, and other is out of it:
          queue[i] = current;
          current = other;
          continue main;
        }
      }

      // if we made it this far, this component should receive the touch event. Afterwards, add it to the `sent` array
      // so that we know we have sent touches to it, and continue through the queue.
      callback(current);
      sent.push(current);
      current = queue.pop();
    }
  }

  handleTouchStart(event, recognizers) {
    const touches = event.touches;
    this.handleTouchEvent(recognizers, recognizer => recognizer.touchesBegan(touches, event));
    // TODO(lmr): if any recognizer still has state POSSIBLE, stopPropagation on the event?
  }

  handleTouchMove(event, recognizers) {
    const touches = event.touches;
    this.handleTouchEvent(recognizers, recognizer => recognizer.touchesMoved(touches, event));
  }

  handleTouchEnd(event, recognizers) {
    const touches = event.touches;
    this.handleTouchEvent(recognizers, recognizer => recognizer.touchesEnded(touches, event));
  }
}

module.exports = RecognizerManager;
