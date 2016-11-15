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

const global = window;
const document = window.document;
const html = document.documentElement;
const regex = {
  nickname: '^[\u4E00-\u9FA5a-zA-Z]{2,15}$',
  cell: '^(13[0-9]{9}|15[012356789][0-9]{8}|18[0-9][0-9]{8}|14[57][0-9]{8}|17[01678][0-9]{8})$',
  tel: '^(0\\d{2,3})?(\\d{7,8})$',
  email: '^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$',
  integer: '^\\d+$',
  chinese: '^[\\u4E00-\\u9FA5]+$'
};

const isType = (function(regex) {
  return function(type, obj) {
    switch (type) {
      case 'nickname' :
      case 'cell' :
      case 'tel' :
      case 'email' :
      case 'integer' :
      case 'chinese' :
        return _.isString(obj) && regex[type].test(obj);

      case 'phone' :
        return regex['tel'].test(obj) && regex['cell'].test(obj);

      default :
        return false;
    }
  };
})({
  nickname: new RegExp(regex.nickname),
  cell: new RegExp(regex.cell),
  tel: new RegExp(regex.tel),
  email: new RegExp(regex.email),
  integer: new RegExp(regex.integer),
  chinese: new RegExp(regex.chinese)
});

const createElement = function(tagName) {
  return this.createElement(tagName);
}.bind(document);
const getComputedStyle = function(target, pseudo) {
  return this.getComputedStyle(target, pseudo);
}.bind(global);

const setCookie = (name, value, exp, options) => {
  let cookie = '';

  if (_.isNumber(exp)) {
    let date = new Date();
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
};

const query2json = () => {
  let queryStr = global.location.search.split('?').pop();
  let queryKey;

  // 如果queryStr不符合query的格式但符合key的格式，那么queryStr就代表key
  switch (arguments.length) {
    case 1 :
      if (_.isString(arguments[0]) && _.includes(arguments[0], '=')) {
        queryStr = arguments[0];
      } else if (_.isArray(arguments[0]) || (_.isString(arguments[0]) && !_.includes(arguments[0], '='))) {
        queryKey = arguments[0];
      };

      break;

    case 2 :
      queryStr = arguments[0];
      queryKey = arguments[1];

      break;
  };

  if (!queryStr || !_.includes(queryStr, '=')) return null;

  let data = Object.defineProperty({}, 'length', {
    value: 0,
    writable: true,
    enumerable: false
  });

  _.forEach(queryStr.split('&'), function(param, index) {
    let paramArr = param.split('=');
    if (paramArr.length === 2) {
      data[paramArr[0]] = paramArr[1];
      data.length ++;
    };
  });

  if (_.isString(queryKey)) {
    return data[queryKey];
  } else if (_.isArray(queryKey)) {
    return (function(keyArr, result) {
      _.forEach(keyArr, function(name, index) {
        result[name] = data[name];
        result.length ++;
      });

      return result;
    })(queryKey, Object.defineProperty({}, 'length', {
      value: 0,
      writable: true,
      enumerable: false
    }));
  } else if (queryKey === undefined) {
    return data;
  };
};

const cookie2json = (key) => {
  let cookie = document.cookie;

  if (!cookie || !_.includes(cookie, '=')) return null;

  return query2json(cookie.replace(/; /g, '&'), key);
};

const formatStr = (str, pattern = 4, maxLength, separator = ' ') => {
  if (!_.isString(str)) return '';

  let text = '';

  if (_.isString(pattern)) {
    const patternArr = pattern.split('');
    const patternLen = pattern.length - pattern.match(/;/g).length;

    for (let i = 0, loop = 0; i < str.length; i++) {
      if (patternArr[i + loop] === ';') {
        loop++;
        text += separator;
      };

      text += str[i];

      if (i === patternLen - 1) break;
    };
  } else if (_.isNumber(pattern)) {
    if (!_.isNumber(maxLength) || maxLength < 1) return;

    for (let i = 0; i < str.length; i++) {
      if (i > 0 && i % pattern === 0) text += separator;

      text += str[i];

      if (i + 1 > maxLength - 1) break;
    };
  };

  return text;
};

const getDate = (function() {
  // 周
  const weekArr = ['日', '一', '二', '三', '四', '五', '六'];

  const dateFixed = function(number, fix) {
    return ('0' + (number + fix)).slice(-2);
  };

  const getDateArr = function(year, month, date, days, array) {
    // 每个月多少天
    const nowDays = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 明年
    const nextYear = year + 1;
    // 下个月
    const nextMonth = month === 11 ? 0 : month + 1;

    for (let i = date; i <= nowDays[month]; i++) {
      array.push([year, dateFixed(month, 1), dateFixed(i, 0)]);
      if (--days === 0) break;
    };

    if (days > 0) getDateArr(nextMonth === 0 ? nextYear : year, nextMonth, 1, days, array);

    return array;
  };

  const pushDay = function(dateArr, weekStart) {
    for (let i = 0, length = dateArr.length; i < length; i++) {
      let index = (weekStart + i) % 7;
      dateArr[i].push(weekArr[index], index);
    };

    return dateArr;
  };

  return function() {
    let nowDate;

    if (arguments.length === 1) {
      // 获取当前时间
      nowDate = new Date();
    } else if (arguments.length === 2) {
      // 自定义开始时间
      nowDate = new Date(arguments[1].toString());
    };

    return pushDay(getDateArr(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), arguments[0], []), nowDate.getDay());
  };
})();

const UA = (function() {
  const ua = navigator.userAgent.toLowerCase();
  const android = ua.match(/(android);?[\s/]+([\d.]+)?/i);
  const ipad = ua.match(/(ipad).*os\s([\d_]+)/i);
  const ipod = ua.match(/(ipod)(.*os\s([\d_]+))?/i);
  const iphone = !ipad && ua.match(/(iphone\sos)\s([\d_]+)/i);

  return {
    isiOS: function(ver) {
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
    isAndroid: function(ver) {
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
    isMobile: function() {
      return this.isiOS() || this.isAndroid();
    },
    isBrowser: (function() {
      let index = {
        wechat: _.indexOf(ua, 'micromessenger'),
        qq: _.indexOf(ua, 'qq'),
        mqq: _.indexOf(ua, 'mqqbrowser'),
        uc: _.indexOf(ua, 'ucbrowser'),
        safari: _.indexOf(ua, 'safari'),
        chrome: _.indexOf(ua, 'chrome'),
        firefox: _.indexOf(ua, 'firefox')
      };

      return function(name) {
        if (!(name in index)) return false;

        if (name === 'safari') {
          return index.safari >= 0 && index.chrome === -1;
        } else if (name === 'qq') {
          return index.qq >= 0 && index.mqq === -1;
        } else {
          return index[name] >= 0;
        }
      };
    })(),
    isKernel: function(name) {
      return !!ua.match(name);
    },
    isWebkit: function() {
      return this.isKernel('applewebkit');
    }
  };
})();

const isPageBottom = (threshold) => document.documentElement.offsetHeight - global.pageYOffset - global.outerHeight <= (_.isNumber(threshold) ? threshold : 0);

const isChildNode = (childNode, parentNode) => {
  if (childNode === parentNode) return true;
  let target = childNode;

  while (target && target.nodeType !== 11) {
    if (target === parentNode) {
      return true;
    } else {
      target = target.parentNode;
    };
  };

  return false;
};

const px2rem = (px) => parseFloat(px) / parseInt(getComputedStyle(html, ':root').fontSize) + 'rem';

const rem2px = (rem) => parseFloat(rem) * parseInt(getComputedStyle(html, ':root').fontSize);

const htmlpx2rem = (function() {
  const styleRegex = /style="([^"]+)"/ig;
  const classRegex = /class="([^"]+)"/ig;

  return function(html) {
    if (!_.isString(html)) return html;

    const beforeArr = html.match(styleRegex);
    const afterArr = [];
    const placeholder = '{{#}}';
    let newHtml = html.replace(styleRegex, placeholder).replace(classRegex, '');

    if (beforeArr !== null) {
      for (let styleStr of beforeArr) {
        const temp = styleStr.replace('style="', '').replace(/([\d]+)px/ig, function() {
          return arguments[1] / 100 + 'rem';
        }).replace(/(font-family:[^;]*(;)?)/ig, '');
        const tempArry = temp.split(';');
        let tempStr = '';

        for (let styleRule of tempArry) {
          if (styleRule && _.includes(styleRule, ':')) tempStr += styleRule.trim().toLowerCase().replace(': ', ':') + ';';
        };

        afterArr.push('style="' + tempStr + '"');
      };
    };

    for (let styleStr of afterArr) {
      newHtml = newHtml.replace(placeholder, styleStr);
    };

    return newHtml;
  };
}());

const autoRootEM = (scale) => {
  if (!scale) return;

  const getRootSize = () => Math.floor(global.innerWidth / scale * 625) + '%';
  const remStyle = (function(rootem) {
    document.head.appendChild(rootem);
    rootem.type = 'text/css';
    rootem.id = 'html:root@rem';
    rootem.sheet.insertRule('html:root{font-size:' + getRootSize() + '}', 0);

    return rootem.sheet.cssRules[0].style;
  })(createElement('style'));
  const update = (evt) => {
    if (evt && evt.type === 'orientationchange') setTimeout(update, 50);
    return (remStyle.fontSize = getRootSize());
  };

  global.addEventListener('resize', update);
  global.addEventListener('load', update);
  global.addEventListener('orientationchange', update);

  document.addEventListener('DOMContentLoaded', update);
  document.addEventListener('readystatechange', update);

  return update();
};

const disableScroll = (function() {
  const preventEvent = (evt) => {
    if ((evt.type === 'keydown' && evt.keyCode >= 33 && evt.keyCode <= 40) || evt.type === 'touchmove' || evt.type === 'mousewheel') evt.preventDefault();
  };

  return function() {
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
})();

const Sprite = {
  is: isType,
  setCookie,
  query2json,
  cookie2json,
  formatStr,
  getDate,
  UA,
  host: {
    query: query2json(),
    path: location.href.split('//')[1].toLowerCase().split('/')
  },
  isPageBottom,
  isChildNode,
  px2rem,
  rem2px,
  htmlpx2rem,
  autoRootEM,
  disableScroll
};

export default Sprite;
