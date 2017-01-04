const invariant = require('invariant');

// This is a map of keys (uuids) to arrays of gesture recognizers. Each key maps 1:1 with a DOM Node.
const REGISTRY = {};

// this is the unique key for the data attribute that we will attach to DOM nodes' dataSet.
const RECOGNIZER_KEY = '__GESTIO_RECOGNIZER_KEY__';

// super basic uuid generator.
const UUID = (function() {
  let _uuid = 1; // start with 1 so that key will always be truthy
  return () => _uuid++;
}());


/**
 * Gets the key/UUID for a provided DOMElement. If the node doesn't currently have one, it will
 * create one and attach it to the dataset.
 *
 * @param {DOMElement} view
 * @returns {String}
 */
function keyForView(view) {
  let key = view.dataset[RECOGNIZER_KEY];
  if (!key) {
    key = view.dataset[RECOGNIZER_KEY] = UUID();
  }
  return key;
}

/**
 * Gets an array of recognizers for a DOM Node. If node is not in registry, it will put it into the
 * registry with an empty array and return that.
 *
 * @param {DOMElement} view
 * @returns {Array<GestureRecognizer>}
 */
function recognizersForView(view) {
  const key = keyForView(view);
  let recognizers = REGISTRY[key];
  if (!recognizers) {
    recognizers = REGISTRY[key] = []; // TODO(lmr): could be Set()?
  }
  return recognizers;
}

/**
 * Appends the recognizer to the array of recognizers for this element.
 *
 * @param {GestureRecognizer} recognizer
 * @param {DOMElement} view
 */
function attachRecognizerToView(recognizer, view) {
  const recognizers = recognizersForView(view);
  recognizers.push(recognizer);
}

/**
 * Removes the recognizer from the view's registry so that the recognizer can be GC'd,
 * if appropriate.
 *
 * @param {GestureRecognizer} recognizer
 * @param {DOMElement} view
 */
function detachRecognizerFromView(recognizer, view) {
  const recognizers = recognizersForView(view);
  const index = recognizers.indexOf(recognizer);
  invariant(index !== -1, 'Tried to detach a recognizer from a view it was not attached to');
  recognizers.splice(index, 1);
}

function releaseView(view) {
  // TODO(lmr): not implemented. (not needed?)
}

/**
 * Traverses "up" the view hierarchy looking for attached recognizers.
 * Always returns an array.
 *
 * @param {DOMElement} view
 * @returns {Array}
 */
function recognizersForViewHierarchy(view) {
  const recognizers = [];
  let node = view;
  while (node) {
    // technically, this if check isn't required, but if we don't use it, then `recognizersForView`
    // will create an empty array for every single DOM Node that it traverses, as well as populate
    // the dataset key.
    if (node.dataset[RECOGNIZER_KEY]) {
      recognizers.push.apply(recognizers, recognizersForView(node));
    }
    node = node.parentNode;
  }
  return recognizers;
}

module.exports = {
  recognizersForView,
  attachRecognizerToView,
  detachRecognizerFromView,
  recognizersForViewHierarchy,
  releaseView,
};
