# gestio
Declarative DOM-Based Gesture Responder System


### Implementing a Custom Gesture

If you would want to implement a custom gesture using this library, you would create a recognizer class that extended from the base GestureRecognizer class. At this point, you will want this class to implement a basic state machine, transitioning this.state between the various states. This is usually in response to touch events, which are handled in touchesBegan, touchesMoved, and touchesEnded. Additionally, you are free to override a handful of methods which might help you declare dependencies class-wide between other gesture recognizers.

This would look something like this:

```js
const GestureRecognizer = require('./../GestureRecognizer');
const GestureState = require('./../GestureState');

class FooGestureRecognizer extends GestureRecognizer {
  constructor({ someStateINeed }) {
    super();
    this.someStateINeed = someStateINeed;
  }

  touchesBegan(touches, event) {
    // ...
    this.state = GestureState.BEGAN;
    // ...
  }

  touchesMoved(touches, event) {
    // ...
  }

  touchesEnded(touches, event) {
    // ...
  }
}

module.exports = FooGestureRecognizer;
```

### Using the Library

Using the library should be as simple as possible. If you have a DOM Node that you would like to attach a gesture recognizer to (say to detect a "Pinch"), you would do the following:

```
var recognizer = new PinchGestureRecognizer();
var pinchSurface = document.getElementById('pinch-surface');
recognizer.attachToView(pinchSurface);
recognizer.on('action', () => console.log('A pinch is occurring!'));
```

### How it Works

This library listens to touch events at the document/window level. Namely, touchstart, touchmove, and touchend.

When a touch event comes in, the library finds the target view of the event, and finds every gesture recognizer attached to that view, or any parent view all the way up to the document root.

Both this list of gesture recognizers and the touch event are sent to the RecognizerManager, which then figures out what the right gesture recognizer to receive the touches is, based on their current states and their declared dependencies on one another (ie, requiring another gesture recognizer to fail, etc.). Depending on the dependencies declared, some gesture recognizers might not receive touch events to analyze.

Once a gesture is recognized, the action event on the recognizer is emitted, which application code can listen for and react to.



## Notes / Rules

### Action methods and state transitions

Every time a gesture recognizer changes state, the gesture recognizer sends an action message to its target, unless it
transitions to Failed or Canceled. Thus, a discrete gesture recognizer sends only a single action message when it
transitions from Possible to Recognized. A continuous gesture recognizer sends many action messages as it changes states.

When a gesture recognizer reaches the Recognized (or Ended) state, it resets its state back to Possible. The transition
back to Possible does not trigger an action message.


### Order of Touch Events

By default, there is no set order for which gesture recognizers receive a touch first, and for this reason touches can
be passed to gesture recognizers in a different order each time. You can override this default behavior to:

Specify that one gesture recognizer should analyze a touch before another gesture recognizer.
Allow two gesture recognizers to operate simultaneously.
Prevent a gesture recognizer from analyzing a touch.





## Usage

## Questions / Problems Not Yet Solved

1. How should gestio handle mouse events? Should it prevent default propagation for touch events? What is the right way
to handle this?
2. Should I have `.state` be a getter/setter and respond to state transitions in the setter method? Or should I wait
for touch events?
3. Discreet versus continuous gestures?
4. It sounds like before a recognizer receives *any* touch events, we first need to check all of the other recognizers
to see if the recognizer requires any of the others to fail first.
5. If a recognizer cancels or fails after a touchMove, does it no longer receive any further touches from that touch? If
so, do we need to keep track of whether or not the recognizer failed already?



