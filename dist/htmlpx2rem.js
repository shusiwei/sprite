var _this = this;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import { isString, isArray, forEach, includes, trim } from 'tiny';

var styleRegex = /style="([^"]+)"/ig;
var classRegex = /class="([^"]+)"/ig;

export default (function (html) {
  _newArrowCheck(this, _this);

  if (!isString(html)) throw new TypeError('html must b a html string');

  var beforeArr = html.match(styleRegex);
  var afterArr = [];
  var placeholder = '{#}';
  var newHtml = html.replace(styleRegex, placeholder).replace(classRegex, '');

  if (isArray(beforeArr)) {
    forEach(beforeArr, function (styleStr) {
      _newArrowCheck(this, _this);

      var temp = styleStr.replace('style="', '').replace(/([\d]+)px/ig, function () {
        _newArrowCheck(this, _this);

        return (arguments.length <= 1 ? undefined : arguments[1]) / 100 + 'rem';
      }.bind(this)).replace(/(font-family:[^;]*(;)?)/ig, '');
      var tempArry = temp.split(';');
      var tempStr = '';

      for (var _iterator = tempArry, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var styleRule = _ref;

        if (styleRule && includes(styleRule, ':')) tempStr += trim(styleRule).toLowerCase().replace(': ', ':') + ';';
      };

      afterArr.push('style="' + tempStr + '"');
    }.bind(this));

    forEach(afterArr, function (styleStr) {
      _newArrowCheck(this, _this);

      newHtml = newHtml.replace(placeholder, styleStr);
    }.bind(this));
  };

  return newHtml;
}).bind(this);