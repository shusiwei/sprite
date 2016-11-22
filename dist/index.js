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
import { isNumber, isPlainObject, isString, isArray, includes, forEach, indexOf } from 'tiny';

var global = window;
var document = window.document;
var html = document.documentElement;

var createElement = function (tagName) {
  return this.createElement(tagName);
}.bind(document);
var getComputedStyle = function (target, pseudo) {
  return this.getComputedStyle(target, pseudo);
}.bind(global);

var isType = function (regex) {
  return function (type, obj) {
    switch (type) {
      case 'nickname':
      case 'cell':
      case 'tel':
      case 'email':
      case 'chinese':
        return isString(obj) && regex[type].test(obj);

      case 'phone':
        return regex['tel'].test(obj) && regex['cell'].test(obj);

      default:
        return false;
    }
  };
}({
  nickname: /^[\u4E00-\u9FA5a-zA-Z]{2,15}$/,
  cell: /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0-9][0-9]{8}|14[57][0-9]{8}|17[01678][0-9]{8})$/,
  tel: /^(0\d{2,3})?(\d{7,8})$/,
  email: /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
  chinese: /^[\u4E00-\u9FA5]+$/
});

var setCookie = function (name, value, exp, options) {
  _newArrowCheck(this, _this);

  var cookie = '';

  if (isNumber(exp)) {
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);

    cookie += name + '=' + value + ';expires=' + date.toGMTString();
  } else {
    cookie += name + '=' + value + ';';
  };

  if (isPlainObject(options)) {
    if (options.path) cookie += ';path=' + options.path;
    if (options.domain) cookie += ';domain=' + options.domain;
    if (options.secure) cookie += ';domain=' + options.secure;
  };

  document.cookie = cookie;

  return cookie2json(name);
}.bind(this);

var query2json = function () {
  _newArrowCheck(this, _this);

  var queryStr = global.location.search.split('?').pop();
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

  var cookie = document.cookie;

  if (!cookie || !includes(cookie, '=')) return null;

  return query2json(cookie.replace(/; /g, '&'), key);
}.bind(this);

var formatStr = function (str) {
  var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  var maxLength = arguments[2];
  var separator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ' ';

  _newArrowCheck(this, _this);

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

    for (var _i = 0; _i < str.length; _i++) {
      if (_i > 0 && _i % pattern === 0) text += separator;

      text += str[_i];

      if (_i + 1 > maxLength - 1) break;
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
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
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

  return parseFloat(value) / parseInt(getComputedStyle(html, ':root').fontSize) + 'rem';
}.bind(this);

var rem2px = function (value) {
  _newArrowCheck(this, _this);

  return parseFloat(value) * parseInt(getComputedStyle(html, ':root').fontSize);
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
      for (var _iterator = beforeArr, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _styleStr$replace;

        var _ref;

        if (_isArray) {
          if (_i2 >= _iterator.length) break;
          _ref = _iterator[_i2++];
        } else {
          _i2 = _iterator.next();
          if (_i2.done) break;
          _ref = _i2.value;
        }

        var styleStr = _ref;

        var temp = (_styleStr$replace = styleStr.replace('style="', '')).replace.apply(_styleStr$replace, [/([\d]+)px/ig].concat(function (args) {
          _newArrowCheck(this, _this3);

          return args[1] / 100 + 'rem';
        }.bind(this))).replace(/(font-family:[^;]*(;)?)/ig, '');
        var tempArry = temp.split(';');
        var tempStr = '';

        for (var _iterator2 = tempArry, _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i3 >= _iterator2.length) break;
            _ref2 = _iterator2[_i3++];
          } else {
            _i3 = _iterator2.next();
            if (_i3.done) break;
            _ref2 = _i3.value;
          }

          var styleRule = _ref2;

          if (styleRule && includes(styleRule, ':')) tempStr += styleRule.trim().toLowerCase().replace(': ', ':') + ';';
        };

        afterArr.push('style="' + tempStr + '"');
      };
    };

    for (var _iterator3 = afterArr, _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i4 >= _iterator3.length) break;
        _ref3 = _iterator3[_i4++];
      } else {
        _i4 = _iterator3.next();
        if (_i4.done) break;
        _ref3 = _i4.value;
      }

      var _styleStr = _ref3;

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

    return Math.floor(global.innerWidth / scale * 625) + '%';
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

  global.addEventListener('resize', update);
  global.addEventListener('load', update);
  global.addEventListener('orientationchange', update);

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

    this.position = getComputedStyle(this.target).position;

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
export { isType, setCookie, query2json, cookie2json, formatStr, getDate, UA, isChildNode, px2rem, htmlpx2rem, autoRootEM, disableScroll, Sticky };