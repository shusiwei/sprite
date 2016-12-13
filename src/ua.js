import {includes} from 'tiny';

const ua = window.navigator.userAgent.toLowerCase();
const android = ua.match(/(android);?[\s/]+([\d.]+)?/i);
const ipad = ua.match(/(ipad).*os\s([\d_]+)/i);
const ipod = ua.match(/(ipod)(.*os\s([\d_]+))?/i);
const iphone = !ipad && ua.match(/(iphone\sos)\s([\d_]+)/i);

const isiOS = (...args) => (ipad || ipod || iphone) && (args.length === 0 || ua.match(/(os)\s([\d_]+)/)[2].replace(/_/g, '.').search(args[0]) === 0);
const isAndroid = (...args) => android && (args.length === 0 || android[2].search(args[0]) === 0);
const isMobile = () => isiOS() || isAndroid();
const isKernel = name => !!ua.match(name);
const isWebkit = () => isKernel('applewebkit');
const isWechat = () => includes(ua, 'micromessenger');
const isSafari = () => includes(ua, 'safari') && !includes(ua, 'chrome');
const isChrome = () => includes(ua, 'chrome');
const isFirefox = () => includes(ua, 'firefox');

export {isiOS, isAndroid, isKernel, isMobile, isWebkit, isWechat, isSafari, isChrome, isFirefox};
