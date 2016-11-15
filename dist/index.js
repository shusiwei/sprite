var _this = this,
    _arguments = arguments;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

/*
 * Helper.js
 * Description : a relaxed javascript library,it relies on jQuery(zepto).
 * Coder : shusiwei
 * Date : 2016-08-22
 * Version : 2.8.22
 *
 * https://github.com/shusiwei/helper
 * Licensed under the MIT license.
 */
import _ from 'wizard';

var global = window;
var document = window.document;
var html = document.documentElement;
var regex = {
  nickname: '^[\u4E00-\u9FA5a-zA-Z]{2,15}$',
  cell: '^(13[0-9]{9}|15[012356789][0-9]{8}|18[0-9][0-9]{8}|14[57][0-9]{8}|17[01678][0-9]{8})$',
  tel: '^(0\\d{2,3})?(\\d{7,8})$',
  email: '^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$',
  integer: '^\\d+$',
  chinese: '^[\\u4E00-\\u9FA5]+$'
};

var isType = function (regex) {
  return function (type, obj) {
    switch (type) {
      case 'nickname':
      case 'cell':
      case 'tel':
      case 'email':
      case 'integer':
      case 'chinese':
        return _.isString(obj) && regex[type].test(obj);

      case 'phone':
        return regex['tel'].test(obj) && regex['cell'].test(obj);

      default:
        return false;
    }
  };
}({
  nickname: new RegExp(regex.nickname),
  cell: new RegExp(regex.cell),
  tel: new RegExp(regex.tel),
  email: new RegExp(regex.email),
  integer: new RegExp(regex.integer),
  chinese: new RegExp(regex.chinese)
});

var createElement = function (tagName) {
  return this.createElement(tagName);
}.bind(document);
var getComputedStyle = function (target, pseudo) {
  return this.getComputedStyle(target, pseudo);
}.bind(global);

var setCookie = function (name, value, exp, options) {
  _newArrowCheck(this, _this);

  var cookie = '';

  if (_.isNumber(exp)) {
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);

    cookie += name + '=' + value + ';expires=' + date.toGMTString();
  } else {
    cookie += name + '=' + value + ';';
  };

  if (_.isObject(options)) {
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
  switch (_arguments.length) {
    case 1:
      if (_.isString(_arguments[0]) && _.includes(_arguments[0], '=')) {
        queryStr = _arguments[0];
      } else if (_.isArray(_arguments[0]) || _.isString(_arguments[0]) && !_.includes(_arguments[0], '=')) {
        queryKey = _arguments[0];
      };

      break;

    case 2:
      queryStr = _arguments[0];
      queryKey = _arguments[1];

      break;
  };

  if (!queryStr || !_.includes(queryStr, '=')) return null;

  var data = Object.defineProperty({}, 'length', {
    value: 0,
    writable: true,
    enumerable: false
  });

  _.forEach(queryStr.split('&'), function (param, index) {
    var paramArr = param.split('=');
    if (paramArr.length === 2) {
      data[paramArr[0]] = paramArr[1];
      data.length++;
    };
  });

  if (_.isString(queryKey)) {
    return data[queryKey];
  } else if (_.isArray(queryKey)) {
    return function (keyArr, result) {
      _.forEach(keyArr, function (name, index) {
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

  if (!cookie || !_.includes(cookie, '=')) return null;

  return query2json(cookie.replace(/; /g, '&'), key);
}.bind(this);

var formatStr = function (str) {
  var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  var maxLength = arguments[2];
  var separator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ' ';

  _newArrowCheck(this, _this);

  if (!_.isString(str)) return '';

  var text = '';

  if (_.isString(pattern)) {
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
  } else if (_.isNumber(pattern)) {
    if (!_.isNumber(maxLength) || maxLength < 1) return;

    for (var _i = 0; _i < str.length; _i++) {
      if (_i > 0 && _i % pattern === 0) text += separator;

      text += str[_i];

      if (_i + 1 > maxLength - 1) break;
    };
  };

  return text;
}.bind(this);

var getDate = function () {
  // 周
  var weekArr = ['日', '一', '二', '三', '四', '五', '六'];

  var dateFixed = function dateFixed(number, fix) {
    return ('0' + (number + fix)).slice(-2);
  };

  var getDateArr = function getDateArr(year, month, date, days, array) {
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
  };

  var pushDay = function pushDay(dateArr, weekStart) {
    for (var i = 0, length = dateArr.length; i < length; i++) {
      var index = (weekStart + i) % 7;
      dateArr[i].push(weekArr[index], index);
    };

    return dateArr;
  };

  return function () {
    var nowDate = void 0;

    if (arguments.length === 1) {
      // 获取当前时间
      nowDate = new Date();
    } else if (arguments.length === 2) {
      // 自定义开始时间
      nowDate = new Date(arguments[1].toString());
    };

    return pushDay(getDateArr(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), arguments[0], []), nowDate.getDay());
  };
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
        wechat: _.indexOf(ua, 'micromessenger'),
        qq: _.indexOf(ua, 'qq'),
        mqq: _.indexOf(ua, 'mqqbrowser'),
        uc: _.indexOf(ua, 'ucbrowser'),
        safari: _.indexOf(ua, 'safari'),
        chrome: _.indexOf(ua, 'chrome'),
        firefox: _.indexOf(ua, 'firefox')
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

var isPageBottom = function (threshold) {
  _newArrowCheck(this, _this);

  return document.documentElement.offsetHeight - global.pageYOffset - global.outerHeight <= (_.isNumber(threshold) ? threshold : 0);
}.bind(this);

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

var px2rem = function (px) {
  _newArrowCheck(this, _this);

  return parseFloat(px) / parseInt(getComputedStyle(html, ':root').fontSize) + 'rem';
}.bind(this);

var rem2px = function (rem) {
  _newArrowCheck(this, _this);

  return parseFloat(rem) * parseInt(getComputedStyle(html, ':root').fontSize);
}.bind(this);

var htmlpx2rem = function () {
  var styleRegex = /style="([^"]+)"/ig;
  var classRegex = /class="([^"]+)"/ig;

  return function (html) {
    if (!_.isString(html)) return html;

    var beforeArr = html.match(styleRegex);
    var afterArr = [];
    var placeholder = '{{#}}';
    var newHtml = html.replace(styleRegex, placeholder).replace(classRegex, '');

    if (beforeArr !== null) {
      for (var _iterator = beforeArr, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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

        var temp = styleStr.replace('style="', '').replace(/([\d]+)px/ig, function () {
          return arguments[1] / 100 + 'rem';
        }).replace(/(font-family:[^;]*(;)?)/ig, '');
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

          if (styleRule && _.includes(styleRule, ':')) tempStr += styleRule.trim().toLowerCase().replace(': ', ':') + ';';
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
  var _this2 = this;

  var preventEvent = function (evt) {
    _newArrowCheck(this, _this2);

    if (evt.type === 'keydown' && evt.keyCode >= 33 && evt.keyCode <= 40 || evt.type === 'touchmove' || evt.type === 'mousewheel') evt.preventDefault();
  }.bind(this);

  return function () {
    if (arguments.length === 0 || arguments[0] === true) {
      // 禁用默认事件，防止页面滚动
      document.body.addEventListener('touchmove', preventEvent);
      document.addEventListener('mousewheel', preventEvent);
      document.addEventListener('keydown', preventEvent);

      return true;
    } else if (arguments[0] === false) {
      document.body.removeEventListener('touchmove', preventEvent);
      document.removeEventListener('mousewheel', preventEvent);
      document.removeEventListener('keydown', preventEvent);

      return false;
    };
  };
}();

var Sprite = {
  is: isType,
  setCookie: setCookie,
  query2json: query2json,
  cookie2json: cookie2json,
  formatStr: formatStr,
  getDate: getDate,
  UA: UA,
  host: {
    query: query2json(),
    path: location.href.split('//')[1].toLowerCase().split('/')
  },
  isPageBottom: isPageBottom,
  isChildNode: isChildNode,
  px2rem: px2rem,
  rem2px: rem2px,
  htmlpx2rem: htmlpx2rem,
  autoRootEM: autoRootEM,
  disableScroll: disableScroll
};

export default Sprite;