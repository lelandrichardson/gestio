const { assert } = require('chai');

const {
  POSSIBLE,
  BEGAN,
  CHANGED,
  RECOGNIZED,
  ENDED,
  FAILED,
  CANCELED,
} = require('../src/GestureState');
const RecognizerManager = require('../src/RecognizerManager');
const GestureRecognizer = require('../src/GestureRecognizer');

function fakeNode() {
  return { dataset: {} };
}

function fakeTouch() {
  return {};
}

function touchEvent() {
  return {
    touches: [
      fakeTouch(),
    ],
  };
}

class TestRecognizer extends GestureRecognizer {
  touchesBegan(touches, event) {
  }

  touchesMoved(touches, event) {
  }

  touchesEnded(touches, event) {
  }

  touchesCanceled(touches, event) {
  }
}


describe('RecognizerManager', () => {
  describe('.handleTouchEvent(recognizers, callback)', () => {
    describe('with a single recognizer', () => {
      it('passes the ', () => {
        const recognizer = new TestRecognizer()
        const recognizers = [
          recognizer,
        ];
        const manager = new RecognizerManager();

        // manager.handleTouchEvent(recognizers, r => console.log('hello'));
        manager.handleTouchEvent(recognizers, r => assert(r === recognizer));
        // assert(recognizer.handleTouchEvent.calledOnce);
        // assert(recognizer.handleTouchEvent.calledWith(recognizer));
      });

      it('skips if failed', () => {
        const recognizer = new TestRecognizer();
        const recognizers = [
          recognizer,
        ];
        recognizer.state = FAILED;
        const manager = new RecognizerManager();

        manager.handleTouchEvent(recognizers, r => console.log('this shouldnt happen'));
      });
    });

    describe('with multiple recognizers', () => {
      it('honors .requireGestureRecognizerToFail', () => {
        const a = new TestRecognizer();
        const b = new TestRecognizer();
        const recognizers = [
          a,
          b,
        ];

        a.requireGestureRecognizerToFail(b);

        const manager = new RecognizerManager();

        // manager.handleTouchEvent(recognizers, r => console.log('hello'));
        manager.handleTouchEvent(recognizers, r => {
          console.log('1');
          assert(r === b, 'r didnt equal a');
        });

        b.state = FAILED;

        manager.handleTouchEvent(recognizers, r => {
          console.log('2');
          assert(r === a);
        });
      });

      it('honors .canPreventGestureRecognizer()', () => {
        const a = new TestRecognizer();
        const b = new TestRecognizer();
        const recognizers = [
          a,
          b,
        ];

        b.canPreventGestureRecognizer = r => r === a;

        const manager = new RecognizerManager();

        // manager.handleTouchEvent(recognizers, r => console.log('hello'));
        manager.handleTouchEvent(recognizers, r => {
          console.log('1');
          assert(r === b, 'r didnt equal a');
        });

        b.state = FAILED;

        manager.handleTouchEvent(recognizers, r => {
          console.log('2');
          assert(r === a);
        });
      });

    });
  });

  it('does stuff', () => {
    const view = fakeNode();
    const recognizers = [
      new TestRecognizer(),
    ];
    const event = touchEvent();
    const manager = new RecognizerManager();


    assert(true);
  });
});
