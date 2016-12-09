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
import { isPlainObject, isString, includes, forEach, indexOf, isPosiInteger } from 'tiny';

var document = window.document;
var documentElement = document.documentElement;

var createElement = function (tagName) {
  _newArrowCheck(this, _this);

  return document.createElement(tagName);
}.bind(this);
var computedStyle = function () {
  var _window;

  _newArrowCheck(this, _this);

  return (_window = window).getComputedStyle.apply(_window, arguments);
}.bind(this);

var addEventListener = function (el, fn) {
  for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    events[_key - 2] = arguments[_key];
  }

  _newArrowCheck(this, _this);

  if (events.length === 0) throw new Error('at least one event name is required');

  for (var _iterator = events, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var event = _ref;

    el.addEventListener(event, fn);
  };

  return el;
}.bind(this);
var removeEventListener = function (el, fn) {
  for (var _len2 = arguments.length, events = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    events[_key2 - 2] = arguments[_key2];
  }

  _newArrowCheck(this, _this);

  if (events.length === 0) throw new Error('at least one event name is required');

  for (var _iterator2 = events, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    var event = _ref2;

    el.removeEventListener(event, fn);
  };

  return el;
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
      return (/^(13[0-9]{9}|15[012356789][0-9]{8}|18[0-9][0-9]{8}|14[57][0-9]{8}|17[01678][0-9]{8})$/.test(value)
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

  if (sources.length === 0) throw new Error('least one parameter is required');

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

  var result = Object.defineProperty({}, 'length', { value: 0, writable: true, enumerable: false });

  forEach(source.replace(/^\?/, '').split('&'), function (string) {
    _newArrowCheck(this, _this);

    var item = string.split('=');

    result[item[0]] = item[1];
    result.length++;
  }.bind(this));

  if (keys.length === 0) return result;
  if (keys.length === 1) return result[keys[0]];

  var dump = Object.defineProperty({}, 'length', { value: 0, writable: true, enumerable: false });

  forEach(keys, function (key) {
    _newArrowCheck(this, _this);

    dump[key] = result[key];
    dump.length++;
  }.bind(this));

  return dump;
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
 * @params {Number} expires 过期天数
 * @params {Object} options 其它参数
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

    if (isPlainObject(options)) {
      if (options.path) cookie += ';path=' + options.path;
      if (options.domain) cookie += ';domain=' + options.domain;
      if (options.secure) cookie += ';secure=' + options.secure;
    };
  };

  document.cookie = cookie;

  return cookieParse();
}.bind(this);

var px2rem = function (value) {
  _newArrowCheck(this, _this);

  return parseFloat(value) / parseInt(computedStyle(documentElement, ':root').fontSize) + 'rem';
}.bind(this);

var rem2px = function (value) {
  _newArrowCheck(this, _this);

  return parseFloat(value) * parseInt(computedStyle(documentElement, ':root').fontSize);
}.bind(this);

var htmlpx2rem = function () {
  var styleRegex = /style="([^"]+)"/ig;
  var classRegex = /class="([^"]+)"/ig;

  return function (html) {
    var _this2 = this;

    if (!isString(html)) return html;

    var beforeArr = html.match(styleRegex);
    var afterArr = [];
    var placeholder = '{{#}}';
    var newHtml = html.replace(styleRegex, placeholder).replace(classRegex, '');

    if (beforeArr !== null) {
      for (var _iterator5 = beforeArr, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
        var _ref5;

        if (_isArray5) {
          if (_i5 >= _iterator5.length) break;
          _ref5 = _iterator5[_i5++];
        } else {
          _i5 = _iterator5.next();
          if (_i5.done) break;
          _ref5 = _i5.value;
        }

        var styleStr = _ref5;

        var temp = styleStr.replace('style="', '').replace(/([\d]+)px/ig, function () {
          _newArrowCheck(this, _this2);

          return (arguments.length <= 1 ? undefined : arguments[1]) / 100 + 'rem';
        }.bind(this)).replace(/(font-family:[^;]*(;)?)/ig, '');
        var tempArry = temp.split(';');
        var tempStr = '';

        for (var _iterator6 = tempArry, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
          var _ref6;

          if (_isArray6) {
            if (_i6 >= _iterator6.length) break;
            _ref6 = _iterator6[_i6++];
          } else {
            _i6 = _iterator6.next();
            if (_i6.done) break;
            _ref6 = _i6.value;
          }

          var styleRule = _ref6;

          if (styleRule && includes(styleRule, ':')) tempStr += styleRule.trim().toLowerCase().replace(': ', ':') + ';';
        };

        afterArr.push('style="' + tempStr + '"');
      };
    };

    for (var _iterator7 = afterArr, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
      var _ref7;

      if (_isArray7) {
        if (_i7 >= _iterator7.length) break;
        _ref7 = _iterator7[_i7++];
      } else {
        _i7 = _iterator7.next();
        if (_i7.done) break;
        _ref7 = _i7.value;
      }

      var _styleStr = _ref7;

      newHtml = newHtml.replace(placeholder, _styleStr);
    };

    return newHtml;
  };
}();

var ua = navigator.userAgent.toLowerCase();
var android = ua.match(/(android);?[\s/]+([\d.]+)?/i);
var ipad = ua.match(/(ipad).*os\s([\d_]+)/i);
var ipod = ua.match(/(ipod)(.*os\s([\d_]+))?/i);
var iphone = !ipad && ua.match(/(iphone\sos)\s([\d_]+)/i);
var browser = {
  wechat: indexOf(ua, 'micromessenger'),
  qq: indexOf(ua, 'qq'),
  mqq: indexOf(ua, 'mqqbrowser'),
  uc: indexOf(ua, 'ucbrowser'),
  safari: indexOf(ua, 'safari'),
  chrome: indexOf(ua, 'chrome'),
  firefox: indexOf(ua, 'firefox')
};

var isiOS = function () {
  _newArrowCheck(this, _this);

  return (ipad || ipod || iphone) && (arguments.length === 0 || ua.match(/(os)\s([\d_]+)/)[2].replace(/_/g, '.').search(arguments.length <= 0 ? undefined : arguments[0]) === 0);
}.bind(this);
var isAndroid = function () {
  _newArrowCheck(this, _this);

  return android && (arguments.length === 0 || android[2].search(arguments.length <= 0 ? undefined : arguments[0]) === 0);
}.bind(this);
var isBrowser = function () {
  _newArrowCheck(this, _this);

  console.warn('isBrowser is deprecated, please use isWechat/isSafari/isChrome/isFirefox');
  if (!(name in browser)) return false;

  if (name === 'safari') {
    return browser.safari >= 0 && browser.chrome === -1;
  } else if (name === 'qq') {
    return browser.qq >= 0 && browser.mqq === -1;
  } else {
    return browser[name] >= 0;
  }
}.bind(this);
var isMobile = function () {
  _newArrowCheck(this, _this);

  return isiOS() || isAndroid();
}.bind(this);
var isKernel = function (name) {
  _newArrowCheck(this, _this);

  return !!ua.match(name);
}.bind(this);
var isWebkit = function () {
  _newArrowCheck(this, _this);

  return isKernel('applewebkit');
}.bind(this);
var isWechat = function () {
  _newArrowCheck(this, _this);

  return includes(ua, 'micromessenger');
}.bind(this);
var isSafari = function () {
  _newArrowCheck(this, _this);

  return includes(ua, 'safari') && !includes(ua, 'chrome');
}.bind(this);
var isChrome = function () {
  _newArrowCheck(this, _this);

  return includes(ua, 'chrome');
}.bind(this);
var isFirefox = function () {
  _newArrowCheck(this, _this);

  return includes(ua, 'firefox');
}.bind(this);
var userAgent = { isiOS: isiOS, isAndroid: isAndroid, isBrowser: isBrowser, isKernel: isKernel, isMobile: isMobile, isWebkit: isWebkit, isWechat: isWechat, isSafari: isSafari, isChrome: isChrome, isFirefox: isFirefox };

var autoRootEM = function (scale) {
  _newArrowCheck(this, _this);

  if (!scale) return;

  var getRootSize = function () {
    _newArrowCheck(this, _this);

    return Math.floor(window.innerWidth / scale * 625) + '%';
  }.bind(this);
  var styleNode = createElement('style');

  document.head.appendChild(styleNode);
  styleNode.type = 'text/css';
  styleNode.id = 'html:root@rem';
  styleNode.sheet.insertRule('html:root{font-size:' + getRootSize() + '}', 0);

  var remStyle = styleNode.sheet.cssRules[0].style;
  var update = function (evt) {
    _newArrowCheck(this, _this);

    if (evt && evt.type === 'orientationchange') setTimeout(update, 50);
    return remStyle.fontSize = getRootSize();
  }.bind(this);

  addEventListener(window, update, 'resize', 'load', 'orientationchange');
  addEventListener(document, update, 'DOMContentLoaded', 'readystatechange');

  return update();
}.bind(this);

var disableScroll = function () {
  var _this3 = this;

  var preventEvent = function (evt) {
    _newArrowCheck(this, _this3);

    if (evt.type === 'keydown' && evt.keyCode >= 33 && evt.keyCode <= 40 || evt.type === 'touchmove' || evt.type === 'mousewheel') evt.preventDefault();
  }.bind(this);

  return function () {
    _newArrowCheck(this, _this3);

    if (arguments.length === 0 || (arguments.length <= 0 ? undefined : arguments[0]) === true) {
      // 禁用默认事件，防止页面滚动
      addEventListener(document.body, preventEvent, 'touchmove');
      addEventListener(document, preventEvent, 'mousewheel', 'keydown');

      return true;
    } else if ((arguments.length <= 0 ? undefined : arguments[0]) === false) {
      removeEventListener(document.body, preventEvent, 'touchmove');
      removeEventListener(document, preventEvent, 'mousewheel', 'keydown');

      return false;
    };
  }.bind(this);
}();

var Sticky = function () {
  function Sticky(target, body) {
    _classCallCheck(this, Sticky);

    this.target = target;
    this.body = body;

    this.position = computedStyle(this.target).position;

    this.bind();
    this.updatePosition();
  }

  Sticky.prototype.updatePosition = function updatePosition() {
    if (this.checkIsHit()) {
      this.target.style.position = this.position;
    } else {
      this.target.style.position = 'fixed';
    };
  };

  Sticky.prototype.checkIsHit = function checkIsHit() {
    var targetRect = this.target.getBoundingClientRect();
    var bodyRect = this.body.getBoundingClientRect();

    return Math.abs(bodyRect.top) + bodyRect.height + targetRect.height > window.outerHeight;
  };

  Sticky.prototype.bind = function bind() {
    var _this4 = this;

    this.event = function () {
      _newArrowCheck(this, _this4);

      return this.updatePosition();
    }.bind(this);

    addEventListener(window, this.event, 'resize', 'scroll');
  };

  Sticky.prototype.destroy = function destroy() {
    removeEventListener(window, this.event, 'resize', 'scroll');
  };

  return Sticky;
}();

;

var getDate = function () {
  var _this5 = this;

  // 周
  var weekArr = ['日', '一', '二', '三', '四', '五', '六'];

  var dateFixed = function (number, fix) {
    _newArrowCheck(this, _this5);

    return ('0' + (number + fix)).slice(-2);
  }.bind(this);

  var getDateArr = function (year, month, date, days, array) {
    _newArrowCheck(this, _this5);

    // 每个月多少天
    var nowDays = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 明年
    var nextYear = year + 1;
    // 下个月
    var nextMonth = month === 11 ? 0 : month + 1;

    for (var i = date; i <= nowDays[month]; i++) {
      array.push([year, dateFixed(month, 1), dateFixed(i, 0)]);
      if (--days === 0) break;
    };

    if (days > 0) getDateArr(nextMonth === 0 ? nextYear : year, nextMonth, 1, days, array);

    return array;
  }.bind(this);

  var pushDay = function (dateArr, weekStart) {
    _newArrowCheck(this, _this5);

    for (var i = 0, length = dateArr.length; i < length; i++) {
      var index = (weekStart + i) % 7;
      dateArr[i].push(weekArr[index], index);
    };

    return dateArr;
  }.bind(this);

  return function () {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    _newArrowCheck(this, _this5);

    var nowDate = void 0;

    if (args.length === 1) {
      // 获取当前时间
      nowDate = new Date();
    } else if (args.length === 2) {
      // 自定义开始时间
      nowDate = new Date(args[1].toString());
    };

    return pushDay(getDateArr(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), args[0], []), nowDate.getDay());
  }.bind(this);
}();

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

var modules = { test: test, serialize: serialize, queryParse: queryParse, cookieParse: cookieParse, setCookie: setCookie, px2rem: px2rem, rem2px: rem2px, htmlpx2rem: htmlpx2rem, userAgent: userAgent, autoRootEM: autoRootEM, disableScroll: disableScroll, Sticky: Sticky, getDate: getDate, isChildNode: isChildNode };
export default modules;
export { test, serialize, queryParse, cookieParse, setCookie, px2rem, rem2px, htmlpx2rem, userAgent, autoRootEM, disableScroll, Sticky, getDate, isChildNode };