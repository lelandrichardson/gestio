const GestureState = require('./GestureState');
const GestureRecognizer = require('./GestureRecognizer');
const RecognizerManager = require('./RecognizerManager');
const GestureRegistry = require('./GestureRegistry');

function bootstrap(window) {
  const manager = new RecognizerManager();

  window.addEventListener('touchstart', (event) => {
    //console.log('touchstart');
    const recognizers = GestureRegistry.recognizersForViewHierarchy(event.target);
    manager.handleTouchStart(event, recognizers);
  }, false);

  window.addEventListener('touchmove', (event) => {
    //console.log('touchmove');
    const recognizers = GestureRegistry.recognizersForViewHierarchy(event.target);
    manager.handleTouchMove(event, recognizers);
  }, false);

  window.addEventListener('touchend', (event) => {
    //console.log('touchend');
    const recognizers = GestureRegistry.recognizersForViewHierarchy(event.target);
    manager.handleTouchEnd(event, recognizers);
  }, false);
}

module.exports = {
  bootstrap,
  GestureState,
  GestureRecognizer,
  RecognizerManager,
  GestureRegistry,
};
