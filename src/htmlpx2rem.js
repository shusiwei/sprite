import {isString, isArray, forEach, includes, trim} from 'tiny';

const styleRegex = /style="([^"]+)"/ig;
const classRegex = /class="([^"]+)"/ig;

export default (html) => {
  if (!isString(html)) throw new TypeError('html must b a html string');

  const beforeArr = html.match(styleRegex);
  const afterArr = [];
  const placeholder = '{#}';
  let newHtml = html.replace(styleRegex, placeholder).replace(classRegex, '');

  if (isArray(beforeArr)) {
    forEach(beforeArr, styleStr => {
      const temp = styleStr.replace('style="', '').replace(/([\d]+)px/ig, (...args) => args[1] / 100 + 'rem').replace(/(font-family:[^;]*(;)?)/ig, '');
      const tempArry = temp.split(';');
      let tempStr = '';

      for (let styleRule of tempArry) {
        if (styleRule && includes(styleRule, ':')) tempStr += trim(styleRule).toLowerCase().replace(': ', ':') + ';';
      };

      afterArr.push('style="' + tempStr + '"');
    });

    forEach(afterArr, styleStr => {
      newHtml = newHtml.replace(placeholder, styleStr);
    });
  };

  return newHtml;
};
