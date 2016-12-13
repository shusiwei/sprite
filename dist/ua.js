var _this = this;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import { includes } from 'tiny';

var ua = window.navigator.userAgent.toLowerCase();
var android = ua.match(/(android);?[\s/]+([\d.]+)?/i);
var ipad = ua.match(/(ipad).*os\s([\d_]+)/i);
var ipod = ua.match(/(ipod)(.*os\s([\d_]+))?/i);
var iphone = !ipad && ua.match(/(iphone\sos)\s([\d_]+)/i);

var isiOS = function () {
  _newArrowCheck(this, _this);

  return (ipad || ipod || iphone) && (arguments.length === 0 || ua.match(/(os)\s([\d_]+)/)[2].replace(/_/g, '.').search(arguments.length <= 0 ? undefined : arguments[0]) === 0);
}.bind(this);
var isAndroid = function () {
  _newArrowCheck(this, _this);

  return android && (arguments.length === 0 || android[2].search(arguments.length <= 0 ? undefined : arguments[0]) === 0);
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

export { isiOS, isAndroid, isKernel, isMobile, isWebkit, isWechat, isSafari, isChrome, isFirefox };