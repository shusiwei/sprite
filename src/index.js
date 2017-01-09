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
import {isPlainObject, isString, forEach, isPosiInteger} from 'tiny';

const document = window.document;

const addEventListener = (el, fn, ...types) => {
  if (types.length === 0) throw new Error('at least one event name is required');

  for (let type of types) {
    el.addEventListener(type, fn);
  };

  return el;
};
const removeEventListener = (el, fn, ...types) => {
  if (types.length === 0) throw new Error('at least one event name is required');

  for (let type of types) {
    el.removeEventListener(type, fn);
  };

  return el;
};

/**
 * @name 创建一个带有类似数组长度的Object对象
 *
 * @return 返回该对象
 */
const makeArrayLikeObject = () => Object.defineProperty({}, 'length', {value: 0, writable: true, enumerable: false});

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

    case 'integer' :
      return /^\d+$/g.test(value);

    default :
      throw new Error('test type support username/cellphone/telephone/phone/email/chinese/integer');
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

  const result = makeArrayLikeObject();

  forEach(source.replace(/^\?/, '').split('&'), string => {
    const item = string.split('=');

    result[item[0]] = item[1];
    result.length++;
  });

  if (keys.length === 0) return result;
  if (keys.length === 1) return result[keys[0]];

  const dumpData = makeArrayLikeObject();

  forEach(keys, key => {
    dumpData[key] = result[key];
    dumpData.length++;
  });

  return dumpData;
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
 * @params {Object} options 过期天数&其它参数
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

    if (isPlainObject(option)) {
      if (option.path) cookie += ';path=' + option.path;
      if (option.domain) cookie += ';domain=' + option.domain;
      if (option.secure) cookie += ';secure=' + option.secure;
    };
  };

  document.cookie = cookie;

  return cookieParse();
};

class Sticky {
  constructor(target, body) {
    this.target = target;
    this.body = body;

    this.position = window.getComputedStyle(this.target).position;

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

    return window.pageYOffset + bodyRect.bottom + targetRect.height > window.innerHeight;
  }
  bind() {
    this.event = () => this.updatePosition();

    addEventListener(window, this.event, 'resize', 'scroll');
  }
  destroy() {
    removeEventListener(window, this.event, 'resize', 'scroll');
  }
};

const isChildNode = (child, parent) => {
  if (child === parent) return true;
  let target = child;

  while (target && target.nodeType !== 11) {
    if (target === parent) {
      return true;
    } else {
      target = target.parentNode;
    };
  };

  return false;
};

const modules = {test, serialize, queryParse, cookieParse, setCookie, Sticky, isChildNode};
export default modules;
export {test, serialize, queryParse, cookieParse, setCookie, Sticky, isChildNode};
