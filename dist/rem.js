var _this = this;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import { isPosiInteger } from 'tiny';

var document = window.document;

export default (function (value) {
  _newArrowCheck(this, _this);

  if (!isPosiInteger(value)) throw new TypeError('reference value must be a Positive integer');

  var element = document.createElement('style');

  document.head.appendChild(element);
  element.type = 'text/css';
  element.sheet.insertRule('html:root{font-size:0}', 0);

  var sheet = element.sheet.cssRules[0].style;
  var update = function (evt) {
    _newArrowCheck(this, _this);

    sheet.fontSize = Math.floor(window.innerWidth / value * 625) + '%';
  }.bind(this);

  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  window.addEventListener('orientationchange', update);
  document.addEventListener('DOMContentLoaded', update);
  document.addEventListener('readystatechange', update);

  return update();
}).bind(this);