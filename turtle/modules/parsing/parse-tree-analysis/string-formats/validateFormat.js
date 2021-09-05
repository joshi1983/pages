import { absoluteUrl } from './absoluteUrl.js';
import { gradientSpreadMethod } from './gradientSpreadMethod.js';
import { lineJoinStyle } from './lineJoinStyle.js';

const formats = {
	'absoluteUrl': absoluteUrl,
	'gradientSpreadMethod': gradientSpreadMethod,
	'lineJoinStyle': lineJoinStyle
};

export function validateFormat(format, s) {
	return formats[format](s);
}