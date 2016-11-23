var _this = this;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

/*
 * tyin-node.js
 * Description : A modern JavaScript utility library for browser.
 * Coder : shusiwei
 * Date : 2016-08-22
 * Version : 1.0.0
 *
 * https://github.com/shusiwei/tyin-node
 * Licensed under the MIT license.
 */
import { isNumber, isPlainObject, isString, isArray, includes, forEach, indexOf, isPosiInteger } from 'tiny';

var document = window.document;
var documentElement = document.documentElement;

var createElement = function (tagName) {
  _newArrowCheck(this, _this);

  return document.createElement(tagName);
}.bind(this);
var computedStyle = function () {
  var _window;

  _newArrowCheck(this, _this);

  return (_window = window).computedStyle.apply(_window, arguments);
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

    default:
      throw new Error('test type support username/cellphone/telephone/phone/email/chinese');
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
  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  _newArrowCheck(this, _this);

  if (sources.length === 0) throw new Error('least one parameter is required');

  var result = [];

  for (var _iterator = sources, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var source = _ref;

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
  for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    keys[_key2 - 1] = arguments[_key2];
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
  for (var _len3 = arguments.length, keys = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    keys[_key3] = arguments[_key3];
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
  for (var _len4 = arguments.length, options = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    options[_key4 - 2] = arguments[_key4];
  }

  _newArrowCheck(this, _this);

  var cookie = name + '=' + value;

  for (var _iterator2 = options, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    var option = _ref2;

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

  return cookie2json();
}.bind(this);

var isType = function (type, obj) {
  _newArrowCheck(this, _this);

  console.warn('is method deprecated, plase use test method');

  switch (type) {
    case 'nickname':
      return test('username', obj);

    case 'cell':
      return test('cellphone', obj);

    case 'tel':
      return test('telephone', obj);

    case 'email':
      return test('email', obj);

    case 'chinese':
      return test('chinese', obj);

    case 'phone':
      return test('phone', obj);
  }
}.bind(this);

var query2json = function () {
  _newArrowCheck(this, _this);

  console.warn('query2json method deprecated, plase use queryParse method');

  var queryStr = window.location.search.split('?').pop();
  var queryKey = void 0;

  // 如果queryStr不符合query的格式但符合key的格式，那么queryStr就代表key
  switch (arguments.length) {
    case 1:
      if (isString(arguments.length <= 0 ? undefined : arguments[0]) && includes(arguments.length <= 0 ? undefined : arguments[0], '=')) {
        queryStr = arguments.length <= 0 ? undefined : arguments[0];
      } else if (isArray(arguments.length <= 0 ? undefined : arguments[0]) || isString(arguments.length <= 0 ? undefined : arguments[0]) && !includes(arguments.length <= 0 ? undefined : arguments[0], '=')) {
        queryKey = arguments.length <= 0 ? undefined : arguments[0];
      };

      break;

    case 2:
      queryStr = arguments.length <= 0 ? undefined : arguments[0];
      queryKey = arguments.length <= 1 ? undefined : arguments[1];

      break;
  };

  if (!queryStr || !includes(queryStr, '=')) return null;

  var data = Object.defineProperty({}, 'length', {
    value: 0,
    writable: true,
    enumerable: false
  });

  forEach(queryStr.split('&'), function (param, index) {
    var paramArr = param.split('=');
    if (paramArr.length === 2) {
      data[paramArr[0]] = paramArr[1];
      data.length++;
    };
  });

  if (isString(queryKey)) {
    return data[queryKey];
  } else if (isArray(queryKey)) {
    return function (keyArr, result) {
      forEach(keyArr, function (name, index) {
        result[name] = data[name];
        result.length++;
      });

      return result;
    }(queryKey, Object.defineProperty({}, 'length', {
      value: 0,
      writable: true,
      enumerable: false
    }));
  } else if (queryKey === undefined) {
    return data;
  };
}.bind(this);

var cookie2json = function (key) {
  _newArrowCheck(this, _this);

  console.warn('cookie2json method deprecated, plase use cookieParse method');

  var cookie = document.cookie;

  if (!cookie || !includes(cookie, '=')) return null;

  return queryParse(cookie.replace(/; /g, '&'), key);
}.bind(this);

var formatStr = function (str) {
  var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  var maxLength = arguments[2];
  var separator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ' ';

  _newArrowCheck(this, _this);

  console.warn('formatStr method deprecated, plase use separate method from tiny.js');

  if (!isString(str)) return '';

  var text = '';

  if (isString(pattern)) {
    var patternArr = pattern.split('');
    var patternLen = pattern.length - pattern.match(/;/g).length;

    for (var i = 0, loop = 0; i < str.length; i++) {
      if (patternArr[i + loop] === ';') {
        loop++;
        text += separator;
      };

      text += str[i];

      if (i === patternLen - 1) break;
    };
  } else if (isNumber(pattern)) {
    if (!isNumber(maxLength) || maxLength < 1) return;

    for (var _i3 = 0; _i3 < str.length; _i3++) {
      if (_i3 > 0 && _i3 % pattern === 0) text += separator;

      text += str[_i3];

      if (_i3 + 1 > maxLength - 1) break;
    };
  };

  return text;
}.bind(this);

var getDate = function () {
  var _this2 = this;

  // 周
  var weekArr = ['日', '一', '二', '三', '四', '五', '六'];

  var dateFixed = function (number, fix) {
    _newArrowCheck(this, _this2);

    return ('0' + (number + fix)).slice(-2);
  }.bind(this);

  var getDateArr = function (year, month, date, days, array) {
    _newArrowCheck(this, _this2);

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
    _newArrowCheck(this, _this2);

    for (var i = 0, length = dateArr.length; i < length; i++) {
      var index = (weekStart + i) % 7;
      dateArr[i].push(weekArr[index], index);
    };

    return dateArr;
  }.bind(this);

  return function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _newArrowCheck(this, _this2);

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

var UA = function () {
  var ua = navigator.userAgent.toLowerCase();
  var android = ua.match(/(android);?[\s/]+([\d.]+)?/i);
  var ipad = ua.match(/(ipad).*os\s([\d_]+)/i);
  var ipod = ua.match(/(ipod)(.*os\s([\d_]+))?/i);
  var iphone = !ipad && ua.match(/(iphone\sos)\s([\d_]+)/i);

  return {
    isiOS: function isiOS(ver) {
      if (ipad || ipod || iphone) {
        if (!ver) {
          return true;
        } else {
          if (ua.match(/(os)\s([\d_]+)/)[2].replace(/_/g, '.').search(ver) === 0) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    isAndroid: function isAndroid(ver) {
      if (android) {
        if (!ver) {
          return true;
        } else {
          if (android[2].search(ver) === 0) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    isMobile: function isMobile() {
      return this.isiOS() || this.isAndroid();
    },
    isBrowser: function () {
      var index = {
        wechat: indexOf(ua, 'micromessenger'),
        qq: indexOf(ua, 'qq'),
        mqq: indexOf(ua, 'mqqbrowser'),
        uc: indexOf(ua, 'ucbrowser'),
        safari: indexOf(ua, 'safari'),
        chrome: indexOf(ua, 'chrome'),
        firefox: indexOf(ua, 'firefox')
      };

      return function (name) {
        if (!(name in index)) return false;

        if (name === 'safari') {
          return index.safari >= 0 && index.chrome === -1;
        } else if (name === 'qq') {
          return index.qq >= 0 && index.mqq === -1;
        } else {
          return index[name] >= 0;
        }
      };
    }(),
    isKernel: function isKernel(name) {
      return !!ua.match(name);
    },
    isWebkit: function isWebkit() {
      return this.isKernel('applewebkit');
    }
  };
}();

var isChildNode = function (childNode, parentNode) {
  _newArrowCheck(this, _this);

  if (childNode === parentNode) return true;
  var target = childNode;

  while (target && target.nodeType !== 11) {
    if (target === parentNode) {
      return true;
    } else {
      target = target.parentNode;
    };
  };

  return false;
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
    var _this3 = this;

    if (!isString(html)) return html;

    var beforeArr = html.match(styleRegex);
    var afterArr = [];
    var placeholder = '{{#}}';
    var newHtml = html.replace(styleRegex, placeholder).replace(classRegex, '');

    if (beforeArr !== null) {
      for (var _iterator3 = beforeArr, _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _styleStr$replace;

        var _ref3;

        if (_isArray3) {
          if (_i4 >= _iterator3.length) break;
          _ref3 = _iterator3[_i4++];
        } else {
          _i4 = _iterator3.next();
          if (_i4.done) break;
          _ref3 = _i4.value;
        }

        var styleStr = _ref3;

        var temp = (_styleStr$replace = styleStr.replace('style="', '')).replace.apply(_styleStr$replace, [/([\d]+)px/ig].concat(function (args) {
          _newArrowCheck(this, _this3);

          return args[1] / 100 + 'rem';
        }.bind(this))).replace(/(font-family:[^;]*(;)?)/ig, '');
        var tempArry = temp.split(';');
        var tempStr = '';

        for (var _iterator4 = tempArry, _isArray4 = Array.isArray(_iterator4), _i5 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
          var _ref4;

          if (_isArray4) {
            if (_i5 >= _iterator4.length) break;
            _ref4 = _iterator4[_i5++];
          } else {
            _i5 = _iterator4.next();
            if (_i5.done) break;
            _ref4 = _i5.value;
          }

          var styleRule = _ref4;

          if (styleRule && includes(styleRule, ':')) tempStr += styleRule.trim().toLowerCase().replace(': ', ':') + ';';
        };

        afterArr.push('style="' + tempStr + '"');
      };
    };

    for (var _iterator5 = afterArr, _isArray5 = Array.isArray(_iterator5), _i6 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray5) {
        if (_i6 >= _iterator5.length) break;
        _ref5 = _iterator5[_i6++];
      } else {
        _i6 = _iterator5.next();
        if (_i6.done) break;
        _ref5 = _i6.value;
      }

      var _styleStr = _ref5;

      newHtml = newHtml.replace(placeholder, _styleStr);
    };

    return newHtml;
  };
}();

var autoRootEM = function (scale) {
  _newArrowCheck(this, _this);

  if (!scale) return;

  var getRootSize = function () {
    _newArrowCheck(this, _this);

    return Math.floor(window.innerWidth / scale * 625) + '%';
  }.bind(this);
  var remStyle = function (rootem) {
    document.head.appendChild(rootem);
    rootem.type = 'text/css';
    rootem.id = 'html:root@rem';
    rootem.sheet.insertRule('html:root{font-size:' + getRootSize() + '}', 0);

    return rootem.sheet.cssRules[0].style;
  }(createElement('style'));
  var update = function (evt) {
    _newArrowCheck(this, _this);

    if (evt && evt.type === 'orientationchange') setTimeout(update, 50);
    return remStyle.fontSize = getRootSize();
  }.bind(this);

  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  window.addEventListener('orientationchange', update);

  document.addEventListener('DOMContentLoaded', update);
  document.addEventListener('readystatechange', update);

  return update();
}.bind(this);

var disableScroll = function () {
  var _this4 = this;

  var preventEvent = function (evt) {
    _newArrowCheck(this, _this4);

    if (evt.type === 'keydown' && evt.keyCode >= 33 && evt.keyCode <= 40 || evt.type === 'touchmove' || evt.type === 'mousewheel') evt.preventDefault();
  }.bind(this);

  return function () {
    _newArrowCheck(this, _this4);

    if (arguments.length === 0 || (arguments.length <= 0 ? undefined : arguments[0]) === true) {
      // 禁用默认事件，防止页面滚动
      document.body.addEventListener('touchmove', preventEvent);
      document.addEventListener('mousewheel', preventEvent);
      document.addEventListener('keydown', preventEvent);

      return true;
    } else if ((arguments.length <= 0 ? undefined : arguments[0]) === false) {
      document.body.removeEventListener('touchmove', preventEvent);
      document.removeEventListener('mousewheel', preventEvent);
      document.removeEventListener('keydown', preventEvent);

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
    var _this5 = this;

    this.event = function () {
      _newArrowCheck(this, _this5);

      return this.updatePosition();
    }.bind(this);

    window.addEventListener('resize', this.event);
    window.addEventListener('scroll', this.event);
  };

  Sticky.prototype.destroy = function destroy() {
    window.removeEventListener('resize', this.event);
    window.removeEventListener('scroll', this.event);
  };

  return Sticky;
}();

var $ = {
  is: isType,
  setCookie: setCookie,
  query2json: query2json,
  cookie2json: cookie2json,
  formatStr: formatStr,
  getDate: getDate,
  UA: UA,
  isChildNode: isChildNode,
  px2rem: px2rem,
  rem2px: rem2px,
  htmlpx2rem: htmlpx2rem,
  autoRootEM: autoRootEM,
  disableScroll: disableScroll,
  Sticky: Sticky
};

export default $;
export { isType, setCookie, query2json, cookie2json, formatStr, getDate, UA, isChildNode, px2rem, htmlpx2rem, autoRootEM, disableScroll, Sticky, serialize, queryParse, cookieParse };