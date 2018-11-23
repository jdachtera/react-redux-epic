'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapRootEpic;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _rxjs = require('rxjs');

var _reduxObservable = require('redux-observable');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _symbols = require('./symbols.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var endAction = { type: 'EPIC_END' };
var log = (0, _debug2.default)('react-redux-epic:wrapped-epic');

function wrapRootEpic(userEpic) {
  !(typeof userEpic === 'function') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'wrapRootEpic expects a function but got %. Happy Coding.', userEpic) : (0, _invariant2.default)(false) : void 0;
  var actionsProxy = new _rxjs.Subject();
  var lifecycle = new _rxjs.Subject();
  var subscription = void 0;
  function observableEpic(_actions) {
    actionsProxy = new _rxjs.Subject();
    subscription = new _rxjs.Subscriber();
    lifecycle = new _rxjs.Subject();

    var results = new _rxjs.Subject();
    var actions = new _reduxObservable.ActionsObservable(actionsProxy);
    var actionsSubscription = _actions.subscribe(actionsProxy);

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    var epicsSubscription = userEpic.apply(undefined, [actions].concat(rest)).subscribe(function (action) {
      return results.next(action);
    }, function (err) {
      return results.error(err);
    }, function () {
      log('epics completed');
      lifecycle.complete();
      results.complete();
    });

    subscription.add(epicsSubscription);
    subscription.add(actionsSubscription);
    return results;
  }

  // private methods/properties
  // used internally by render-to-string
  observableEpic[_symbols.$$isWrapped] = true;
  observableEpic[_symbols.$$getObservable] = function () {
    return lifecycle;
  };
  observableEpic[_symbols.$$complete] = function () {
    log('completing actions stream');
    actionsProxy.next(endAction);
    actionsProxy.complete();
  };
  observableEpic[_symbols.$$unsubscribe] = function () {
    log('unsubscribing actions and epic');
    lifecycle.unsubscribe();
    subscription.unsubscribe();
    actionsProxy.unsubscribe();
  };

  return observableEpic;
}