'use strict';

exports.__esModule = true;

var _ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var modality = function modality() {
  if (!_ExecutionEnvironment.canUseDOM) {
    return;
  }

  var styleElement = void 0;
  var hadKeyboardEvent = false;
  var keyboardThrottleTimeoutID = 0;

  var proto = window.Element.prototype;
  var matches = proto.matches || proto.mozMatchesSelector || proto.msMatchesSelector || proto.webkitMatchesSelector;

  // These elements should always have a focus ring drawn, because they are
  // associated with switching to a keyboard modality.
  var keyboardModalityWhitelist = ['input:not([type])', 'input[type=text]', 'input[type=search]', 'input[type=url]', 'input[type=tel]', 'input[type=email]', 'input[type=password]', 'input[type=number]', 'input[type=date]', 'input[type=month]', 'input[type=week]', 'input[type=time]', 'input[type=datetime]', 'input[type=datetime-local]', 'textarea', '[role=textbox]'].join(',');

  /**
   * Disable the focus ring by default
   */
  var initialize = function initialize() {
    // check if the style sheet needs to be created
    var id = 'react-native-modality';
    styleElement = document.getElementById(id);
    if (!styleElement) {
      // removes focus styles by default
      var style = '<style id="' + id + '">:focus { outline: none; }</style>';
      document.head.insertAdjacentHTML('afterbegin', style);
      styleElement = document.getElementById(id);
    }
  };

  /**
   * Computes whether the given element should automatically trigger the
   * `focus-ring`.
   */
  var focusTriggersKeyboardModality = function focusTriggersKeyboardModality(el) {
    if (matches) {
      return matches.call(el, keyboardModalityWhitelist) && matches.call(el, ':not([readonly])');
    } else {
      return false;
    }
  };

  /**
   * Add the focus ring to the focused element
   */
  var addFocusRing = function addFocusRing() {
    if (styleElement) {
      styleElement.disabled = true;
    }
  };

  /**
   * Remove the focus ring
   */
  var removeFocusRing = function removeFocusRing() {
    if (styleElement) {
      styleElement.disabled = false;
    }
  };

  /**
   * On `keydown`, set `hadKeyboardEvent`, to be removed 100ms later if there
   * are no further keyboard events. The 100ms throttle handles cases where
   * focus is redirected programmatically after a keyboard event, such as
   * opening a menu or dialog.
   */
  var handleKeyDown = function handleKeyDown(e) {
    hadKeyboardEvent = true;
    if (keyboardThrottleTimeoutID !== 0) {
      clearTimeout(keyboardThrottleTimeoutID);
    }
    keyboardThrottleTimeoutID = setTimeout(function () {
      hadKeyboardEvent = false;
      keyboardThrottleTimeoutID = 0;
    }, 100);
  };

  /**
   * Display the focus-ring when the keyboard was used to focus
   */
  var handleFocus = function handleFocus(e) {
    if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
      addFocusRing();
    }
  };

  /**
   * Remove the focus-ring when the keyboard was used to focus
   */
  var handleBlur = function handleBlur() {
    if (!hadKeyboardEvent) {
      removeFocusRing();
    }
  };

  if (document.body && document.body.addEventListener) {
    initialize();
    document.body.addEventListener('keydown', handleKeyDown, true);
    document.body.addEventListener('focus', handleFocus, true);
    document.body.addEventListener('blur', handleBlur, true);
  }
}; /**
    * Adapts focus styles based on the user's active input modality (i.e., how
    * they are interacting with the UI right now).
    *
    * Focus styles are only relevant when using the keyboard to interact with the
    * page. If we only show the focus ring when relevant, we can avoid user
    * confusion without compromising accessibility.
    *
    * The script uses two heuristics to determine whether the keyboard is being used:
    *
    * 1. a keydown event occurred immediately before a focus event;
    * 2. a focus event happened on an element which requires keyboard interaction (e.g., a text field);
    *
    * Based on https://github.com/WICG/focus-ring
    *
    * @noflow
    */

exports.default = modality;