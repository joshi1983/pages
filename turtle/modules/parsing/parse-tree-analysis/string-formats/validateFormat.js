import { absoluteUrl } from './absoluteUrl.js';
import { dataTypes } from './dataTypes.js';
import { gradientSpreadMethod } from './gradientSpreadMethod.js';
import { lineCap } from './lineCap.js';
import { lineJoinStyle } from './lineJoinStyle.js';
import { stepPosition } from './stepPosition.js';

const formats = {
	'absoluteUrl': absoluteUrl,
	'dataTypes': dataTypes,
	'gradientSpreadMethod': gradientSpreadMethod,
	'lineCap': lineCap,
	'lineJoinStyle': lineJoinStyle,
	'stepPosition': stepPosition
};

export function validateFormat(format, s) {
	return formats[format](s);
}