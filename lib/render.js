'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _reactDom = require('react-dom');

var _rxjs = require('rxjs');

// render(
//   element: ReactElement,
//   container: DOMElement,
// ) => Observable[RootInstance]

function render(element, container) {
  return _rxjs.Observable.create(function (observer) {
    try {
      (0, _reactDom.render)(element, container, function () {
        observer.next();
      });
    } catch (err) {
      return observer.error(err);
    }

    return function () {
      return (0, _reactDom.unmountComponentAtNode)(container);
    };
  });
}