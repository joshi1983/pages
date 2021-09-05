import { getToName as _rgbGetToName, _rgb } from
'./_rgb.js';

export function getToName(token) {
	return _rgbGetToName(token);
}

export function _rgb32(token, result, options) {
	return _rgb(token, result, options);
};