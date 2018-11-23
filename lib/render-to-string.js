'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderToString;

var _react = require('react');

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _rxjs = require('rxjs');

var _operators = require('rxjs/operators');

var _symbols = require('./symbols.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('react-redux-epic:render-to-string');

// renderToString(
//   Component: ReactComponent,
//   epicMiddleware: EpicMiddleware
// ) => Observable[String]
function renderToString(element, wrappedEpic) {
  function initialRender() {
    !(0, _react.isValidElement)(element) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'renderToString expects a valid react element bot got %s.\n      Make sure you are passing in an element and not a component.\n      Happy Coding.') : (0, _invariant2.default)(false) : void 0;
    !(wrappedEpic && wrappedEpic[_symbols.$$isWrapped]) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'renderToString expects a wrapped root epic but got %s.\n      Make sure you wrap your root epic\n      \'const wrappedEpic = wrapRootEpic(rootEpic);\'\n      and use this wrapped epic in your createEpicMiddleware call\n      \'const epicMiddleware = createEpicMiddleware();\'\n      \'epicMiddleware.run(wrappedEpic);\'\n      Happy Coding.') : (0, _invariant2.default)(false) : void 0;
    try {
      log('first app render');
      _server2.default.renderToStaticMarkup(element);
    } catch (e) {
      return (0, _rxjs.throwError)(e);
    }
    wrappedEpic[_symbols.$$complete]();
    return wrappedEpic[_symbols.$$getObservable]();
  }
  return (0, _rxjs.defer)(initialRender).pipe(
  // allow wrappedEpic[$$complete](); to complete before calling unsubscribe
  // otherwise this could
  (0, _operators.delay)(0), (0, _operators.last)(null, null, null), (0, _operators.map)(function () {
    wrappedEpic[_symbols.$$unsubscribe]();
    log('final app render');
    var markup = _server2.default.renderToString(element);
    return { markup: markup };
  }));
}