var _this = this;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

/*
 * tiny-node.js
 * Description : A modern JavaScript utility library for browser.
 * Coder : shusiwei
 * Date : 2016-08-22
 * Version : 1.0.0
 *
 * https://github.com/shusiwei/tiny-node
 * Licensed under the MIT license.
 */
import { isPlainObject, isString, forEach, isPosiInteger } from 'tiny';

var document = window.document;

var addEventListener = function (el, fn) {
  for (var _len = arguments.length, types = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    types[_key - 2] = arguments[_key];
  }

  _newArrowCheck(this, _this);

  if (types.length === 0) throw new Error('at least one event name is required');

  for (var _iterator = types, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var type = _ref;

    el.addEventListener(type, fn);
  };

  return el;
}.bind(this);
var removeEventListener = function (el, fn) {
  for (var _len2 = arguments.length, types = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    types[_key2 - 2] = arguments[_key2];
  }

  _newArrowCheck(this, _this);

  if (types.length === 0) throw new Error('at least one event name is required');

  for (var _iterator2 = types, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    var type = _ref2;

    el.removeEventListener(type, fn);
  };

  return el;
}.bind(this);

/**
 * @name 创建一个带有类似数组长度的Object对象
 *
 * @return 返回该对象
 */
var makeArrayLikeObject = function () {
  _newArrowCheck(this, _this);

  return Object.defineProperty({}, 'length', { value: 0, writable: true, enumerable: false });
}.bind(this);

/**
 * @name 对字符串进行类型测试
 *
 * @params {String} type * 测试的类型
 * @params {String} value * 测试的字符串
 *
 * @return {Boolean} 测试通过返回真，否则返回假
 */
var test = function (type, value) {
  _newArrowCheck(this, _this);

  if (!isString(value)) throw new TypeError('value must be a String');

  switch (type) {
    case 'username':
      return (/^[\u4E00-\u9FA5a-zA-Z]{2,15}$/.test(value)
      );

    case 'cellphone':
      return (/^(13[0-9]{9}|15[012356789][0-9]{8}|18[0-9][0-9]{8}|14[57][0-9]{8}|17[0-9][0-9]{8})$/.test(value)
      );

    case 'telephone':
      return (/^(0\d{2,3})?(\d{7,8})$/.test(value)
      );

    case 'phone':
      return test('cell', value) && test('tel', value);

    case 'email':
      return (/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)
      );

    case 'chinese':
      return (/^[\u4E00-\u9FA5]+$/.test(value)
      );

    case 'integer':
      return (/^\d+$/g.test(value)
      );

    default:
      throw new Error('test type support username/cellphone/telephone/phone/email/chinese/integer');
  }
}.bind(this);

/**
 * @name 将一个对象序列化为一个queryString字符串
 *
 * @params {Object} source * 操作的对象
 *
 * @return {String} queryString字符串
 */
var serialize = function () {
  for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    sources[_key3] = arguments[_key3];
  }

  _newArrowCheck(this, _this);

  if (sources.length === 0) return '';

  var result = [];

  for (var _iterator3 = sources, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    var source = _ref3;

    if (!isPlainObject(source)) throw new TypeError('source must b a plain Object');

    for (var key in source) {
      if (source[key] !== undefined) result.push(key + '=' + source[key]);
    };
  };

  return result.join('&');
}.bind(this);

/**
 * @name 将一个queryString字符串转化成一个对象
 *
 * @params {String} source * 操作的对象
 * @params {String} keys 需要返回值的key
 *
 * @return {Object} 当keys参数为空时，返回该对象，当keys参数只有一个时，则返回该对象中key为此参数的值，当keys参数有多个时，则以一个对象的形式返回该对象所有keys中的参数的值
 */
var queryParse = function (source) {
  for (var _len4 = arguments.length, keys = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    keys[_key4 - 1] = arguments[_key4];
  }

  _newArrowCheck(this, _this);

  if (!isString(source)) throw new TypeError('source must b a String');

  var result = makeArrayLikeObject();

  forEach(source.replace(/^\?/, '').split('&'), function (string) {
    _newArrowCheck(this, _this);

    var item = string.split('=');

    result[item[0]] = item[1];
    result.length++;
  }.bind(this));

  if (keys.length === 0) return result;
  if (keys.length === 1) return result[keys[0]];

  var dumpData = makeArrayLikeObject();

  forEach(keys, function (key) {
    _newArrowCheck(this, _this);

    dumpData[key] = result[key];
    dumpData.length++;
  }.bind(this));

  return dumpData;
}.bind(this);

/**
 * @name 将cookie字符串转化成一个对象
 *
 * @params {String} keys 需要返回值的key
 *
 * @return {Object} 当keys参数为空时，返回该对象，当keys参数只有一个时，则返回该对象中key为此参数的值，当keys参数有多个时，则以一个对象的形式返回该对象所有keys中的参数的值
 */
var cookieParse = function () {
  for (var _len5 = arguments.length, keys = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    keys[_key5] = arguments[_key5];
  }

  _newArrowCheck(this, _this);

  return queryParse.apply(undefined, [document.cookie.replace(/; /g, '&')].concat(keys));
}.bind(this);

/**
 * @name 设置cookie
 *
 * @params {String} name * cookie名称
 * @params {String} value * cookie值
 * @params {Object} options 过期天数&其它参数
 * @params {String} options.path cookie所在路径
 * @params {String} options.domain cookie所在域
 * @params {String} options.secure cookie是否只允许在安全链接中读取
 */
var setCookie = function (name, value) {
  for (var _len6 = arguments.length, options = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
    options[_key6 - 2] = arguments[_key6];
  }

  _newArrowCheck(this, _this);

  var cookie = name + '=' + value;

  for (var _iterator4 = options, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
    var _ref4;

    if (_isArray4) {
      if (_i4 >= _iterator4.length) break;
      _ref4 = _iterator4[_i4++];
    } else {
      _i4 = _iterator4.next();
      if (_i4.done) break;
      _ref4 = _i4.value;
    }

    var option = _ref4;

    if (isPosiInteger(option)) {
      var date = new Date();
      date.setTime(date.getTime() + option * 24 * 60 * 60 * 1000);

      cookie += ';expires=' + date.toGMTString();
    };

    if (isPlainObject(option)) {
      if (option.path) cookie += ';path=' + option.path;
      if (option.domain) cookie += ';domain=' + option.domain;
      if (option.secure) cookie += ';secure=' + option.secure;
    };
  };

  document.cookie = cookie;

  return cookieParse();
}.bind(this);

var Sticky = function () {
  function Sticky(target, body) {
    _classCallCheck(this, Sticky);

    this.target = target;
    this.body = body;

    this.position = window.getComputedStyle(this.target).position;

    this.bind();
    this.update();
  }

  Sticky.prototype.update = function update() {
    if (this.checkIsHit()) {
      this.target.style.position = this.position;
    } else {
      this.target.style.position = 'fixed';
    };
  };

  Sticky.prototype.checkIsHit = function checkIsHit() {
    var targetRect = this.target.getBoundingClientRect();
    var bodyRect = this.body.getBoundingClientRect();

    return window.pageYOffset + bodyRect.bottom + targetRect.height > window.innerHeight;
  };

  Sticky.prototype.bind = function bind() {
    var _this2 = this;

    this.event = function () {
      _newArrowCheck(this, _this2);

      return this.update();
    }.bind(this);

    addEventListener(window, this.event, 'resize', 'scroll');
  };

  Sticky.prototype.destroy = function destroy() {
    removeEventListener(window, this.event, 'resize', 'scroll');
  };

  return Sticky;
}();

;

var isChildNode = function (child, parent) {
  _newArrowCheck(this, _this);

  if (child === parent) return true;
  var target = child;

  while (target && target.nodeType !== 11) {
    if (target === parent) {
      return true;
    } else {
      target = target.parentNode;
    };
  };

  return false;
}.bind(this);

var modules = { test: test, serialize: serialize, queryParse: queryParse, cookieParse: cookieParse, setCookie: setCookie, Sticky: Sticky, isChildNode: isChildNode };
export default modules;
export { test, serialize, queryParse, cookieParse, setCookie, Sticky, isChildNode };