import {isPosiInteger} from 'tiny';

const document = window.document;

export default (value) => {
  if (!isPosiInteger(value)) throw new TypeError('reference value must be a Positive integer');

  const element = document.createElement('style');

  document.head.appendChild(element);
  element.type = 'text/css';
  element.sheet.insertRule('html:root{font-size:0}', 0);

  const sheet = element.sheet.cssRules[0].style;
  const update = (evt) => {
    sheet.fontSize = Math.floor(window.innerWidth / value * 625) + '%';
  };

  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  window.addEventListener('orientationchange', update);
  document.addEventListener('DOMContentLoaded', update);
  document.addEventListener('readystatechange', update);

  return update();
};
