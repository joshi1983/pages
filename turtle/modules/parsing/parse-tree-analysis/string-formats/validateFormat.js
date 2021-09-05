import { absoluteUrl } from './absoluteUrl.js';
import { gradientSpreadMethod } from './gradientSpreadMethod.js';
import { lineJoinStyle } from './lineJoinStyle.js';
import { stepPosition } from './stepPosition.js';

const formats = {
	'absoluteUrl': absoluteUrl,
	'gradientSpreadMethod': gradientSpreadMethod,
	'lineJoinStyle': lineJoinStyle,
	'stepPosition': stepPosition
};

export function validateFormat(format, s) {
	return formats[format](s);
}