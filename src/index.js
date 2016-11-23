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
import {isNumber, isPlainObject, isString, isArray, includes, forEach, indexOf, isPosiInteger} from 'tiny';

const document = window.document;
const documentElement = document.documentElement;

const createElement = (tagName) => document.createElement(tagName);
const computedStyle = (...args) => window.computedStyle(...args);

/**
 * @name 对字符串进行类型测试
 *
 * @params {String} type * 测试的类型
 * @params {String} value * 测试的字符串
 *
 * @return {Boolean} 测试通过返回真，否则返回假
 */
const test = (type, value) => {
  if (!isString(value)) throw new TypeError('value must be a String');

  switch (type) {
    case 'username' :
      return /^[\u4E00-\u9FA5a-zA-Z]{2,15}$/.test(value);

    case 'cellphone' :
      return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0-9][0-9]{8}|14[57][0-9]{8}|17[01678][0-9]{8})$/.test(value);

    case 'telephone' :
      return /^(0\d{2,3})?(\d{7,8})$/.test(value);

    case 'phone' :
      return test('cell', value) && test('tel', value);

    case 'email' :
      return /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);

    case 'chinese' :
      return /^[\u4E00-\u9FA5]+$/.test(value);

    default :
      throw new Error('test type support username/cellphone/telephone/phone/email/chinese');
  }
};

/**
 * @name 将一个对象序列化为一个queryString字符串
 *
 * @params {Object} source * 操作的对象
 *
 * @return {String} queryString字符串
 */
const serialize = (...sources) => {
  if (sources.length === 0) throw new Error('least one parameter is required');

  const result = [];

  for (let source of sources) {
    if (!isPlainObject(source)) throw new TypeError('source must b a plain Object');

    for (let key in source) {
      if (source[key] !== undefined) result.push(key + '=' + source[key]);
    };
  };

  return result.join('&');
};

/**
 * @name 将一个queryString字符串转化成一个对象
 *
 * @params {String} source * 操作的对象
 * @params {String} keys 需要返回值的key
 *
 * @return {Object} 当keys参数为空时，返回该对象，当keys参数只有一个时，则返回该对象中key为此参数的值，当keys参数有多个时，则以一个对象的形式返回该对象所有keys中的参数的值
 */
const queryParse = (source, ...keys) => {
  if (!isString(source)) throw new TypeError('source must b a String');

  const result = Object.defineProperty({}, 'length', {value: 0, writable: true, enumerable: false});

  forEach(source.replace(/^\?/, '').split('&'), string => {
    const item = string.split('=');

    result[item[0]] = item[1];
    result.length++;
  });

  if (keys.length === 0) return result;
  if (keys.length === 1) return result[keys[0]];

  const dump = Object.defineProperty({}, 'length', {value: 0, writable: true, enumerable: false});

  forEach(keys, key => {
    dump[key] = result[key];
    dump.length++;
  });

  return dump;
};

/**
 * @name 将cookie字符串转化成一个对象
 *
 * @params {String} keys 需要返回值的key
 *
 * @return {Object} 当keys参数为空时，返回该对象，当keys参数只有一个时，则返回该对象中key为此参数的值，当keys参数有多个时，则以一个对象的形式返回该对象所有keys中的参数的值
 */
const cookieParse = (...keys) => queryParse(document.cookie.replace(/; /g, '&'), ...keys);

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
const setCookie = (name, value, ...options) => {
  let cookie = name + '=' + value;

  for (let option of options) {
    if (isPosiInteger(option)) {
      const date = new Date();
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
};

const isType = (type, obj) => {
  console.warn('is method deprecated, plase use test method');

  switch (type) {
    case 'nickname' :
      return test('username', obj);

    case 'cell' :
      return test('cellphone', obj);

    case 'tel' :
      return test('telephone', obj);

    case 'email' :
      return test('email', obj);

    case 'chinese' :
      return test('chinese', obj);

    case 'phone' :
      return test('phone', obj);
  }
};

const query2json = (...args) => {
  console.warn('query2json method deprecated, plase use queryParse method');

  let queryStr = window.location.search.split('?').pop();
  let queryKey;

  // 如果queryStr不符合query的格式但符合key的格式，那么queryStr就代表key
  switch (args.length) {
    case 1 :
      if (isString(args[0]) && includes(args[0], '=')) {
        queryStr = args[0];
      } else if (isArray(args[0]) || (isString(args[0]) && !includes(args[0], '='))) {
        queryKey = args[0];
      };

      break;

    case 2 :
      queryStr = args[0];
      queryKey = args[1];

      break;
  };

  if (!queryStr || !includes(queryStr, '=')) return null;

  let data = Object.defineProperty({}, 'length', {
    value: 0,
    writable: true,
    enumerable: false
  });

  forEach(queryStr.split('&'), function(param, index) {
    let paramArr = param.split('=');
    if (paramArr.length === 2) {
      data[paramArr[0]] = paramArr[1];
      data.length ++;
    };
  });

  if (isString(queryKey)) {
    return data[queryKey];
  } else if (isArray(queryKey)) {
    return (function(keyArr, result) {
      forEach(keyArr, function(name, index) {
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
  console.warn('cookie2json method deprecated, plase use cookieParse method');

  let cookie = document.cookie;

  if (!cookie || !includes(cookie, '=')) return null;

  return queryParse(cookie.replace(/; /g, '&'), key);
};

const formatStr = (str, pattern = 4, maxLength, separator = ' ') => {
  console.warn('formatStr method deprecated, plase use separate method from tiny.js');

  if (!isString(str)) return '';

  let text = '';

  if (isString(pattern)) {
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
  } else if (isNumber(pattern)) {
    if (!isNumber(maxLength) || maxLength < 1) return;

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

  const dateFixed = (number, fix) => ('0' + (number + fix)).slice(-2);

  const getDateArr = (year, month, date, days, array) => {
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

  const pushDay = (dateArr, weekStart) => {
    for (let i = 0, length = dateArr.length; i < length; i++) {
      let index = (weekStart + i) % 7;
      dateArr[i].push(weekArr[index], index);
    };

    return dateArr;
  };

  return (...args) => {
    let nowDate;

    if (args.length === 1) {
      // 获取当前时间
      nowDate = new Date();
    } else if (args.length === 2) {
      // 自定义开始时间
      nowDate = new Date(args[1].toString());
    };

    return pushDay(getDateArr(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), args[0], []), nowDate.getDay());
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
        wechat: indexOf(ua, 'micromessenger'),
        qq: indexOf(ua, 'qq'),
        mqq: indexOf(ua, 'mqqbrowser'),
        uc: indexOf(ua, 'ucbrowser'),
        safari: indexOf(ua, 'safari'),
        chrome: indexOf(ua, 'chrome'),
        firefox: indexOf(ua, 'firefox')
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

const px2rem = (value) => parseFloat(value) / parseInt(computedStyle(documentElement, ':root').fontSize) + 'rem';

const rem2px = (value) => parseFloat(value) * parseInt(computedStyle(documentElement, ':root').fontSize);

const htmlpx2rem = (function() {
  const styleRegex = /style="([^"]+)"/ig;
  const classRegex = /class="([^"]+)"/ig;

  return function(html) {
    if (!isString(html)) return html;

    const beforeArr = html.match(styleRegex);
    const afterArr = [];
    const placeholder = '{{#}}';
    let newHtml = html.replace(styleRegex, placeholder).replace(classRegex, '');

    if (beforeArr !== null) {
      for (let styleStr of beforeArr) {
        const temp = styleStr.replace('style="', '').replace(/([\d]+)px/ig, ...args => args[1] / 100 + 'rem').replace(/(font-family:[^;]*(;)?)/ig, '');
        const tempArry = temp.split(';');
        let tempStr = '';

        for (let styleRule of tempArry) {
          if (styleRule && includes(styleRule, ':')) tempStr += styleRule.trim().toLowerCase().replace(': ', ':') + ';';
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

  const getRootSize = () => Math.floor(window.innerWidth / scale * 625) + '%';
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

  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  window.addEventListener('orientationchange', update);

  document.addEventListener('DOMContentLoaded', update);
  document.addEventListener('readystatechange', update);

  return update();
};

const disableScroll = (function() {
  const preventEvent = (evt) => {
    if ((evt.type === 'keydown' && evt.keyCode >= 33 && evt.keyCode <= 40) || evt.type === 'touchmove' || evt.type === 'mousewheel') evt.preventDefault();
  };

  return (...args) => {
    if (args.length === 0 || args[0] === true) {
      // 禁用默认事件，防止页面滚动
      document.body.addEventListener('touchmove', preventEvent);
      document.addEventListener('mousewheel', preventEvent);
      document.addEventListener('keydown', preventEvent);

      return true;
    } else if (args[0] === false) {
      document.body.removeEventListener('touchmove', preventEvent);
      document.removeEventListener('mousewheel', preventEvent);
      document.removeEventListener('keydown', preventEvent);

      return false;
    };
  };
})();

class Sticky {
  constructor(target, body) {
    this.target = target;
    this.body = body;

    this.position = computedStyle(this.target).position;

    this.bind();
    this.updatePosition();
  }
  updatePosition() {
    if (this.checkIsHit()) {
      this.target.style.position = this.position;
    } else {
      this.target.style.position = 'fixed';
    };
  }
  checkIsHit() {
    const targetRect = this.target.getBoundingClientRect();
    const bodyRect = this.body.getBoundingClientRect();

    return Math.abs(bodyRect.top) + bodyRect.height + targetRect.height > window.outerHeight;
  }
  bind() {
    this.event = () => this.updatePosition();

    window.addEventListener('resize', this.event);
    window.addEventListener('scroll', this.event);
  }
  destroy() {
    window.removeEventListener('resize', this.event);
    window.removeEventListener('scroll', this.event);
  }
}

const $ = {
  is: isType,
  setCookie,
  query2json,
  cookie2json,
  formatStr,
  getDate,
  UA,
  isChildNode,
  px2rem,
  rem2px,
  htmlpx2rem,
  autoRootEM,
  disableScroll,
  Sticky
};

export default $;
export {isType, setCookie, query2json, cookie2json, formatStr, getDate, UA, isChildNode, px2rem, htmlpx2rem, autoRootEM, disableScroll, Sticky, serialize, queryParse, cookieParse};
