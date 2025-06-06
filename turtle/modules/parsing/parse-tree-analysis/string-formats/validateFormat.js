import { absoluteUrl } from './absoluteUrl.js';
import { dataTypes } from './dataTypes.js';
import { fontWeight } from './fontWeight.js';
import { gradientSpreadMethod } from './gradientSpreadMethod.js';
import { lineCap } from './lineCap.js';
import { lineJoinStyle } from './lineJoinStyle.js';
import { mixBlendMode } from './mixBlendMode.js';
import { numeric } from './numeric.js';
import { stepPosition } from './stepPosition.js';

const formats = {};

[absoluteUrl, dataTypes, fontWeight, gradientSpreadMethod, 
lineCap, lineJoinStyle, mixBlendMode, numeric, stepPosition].forEach(function(f) {
	formats[f.name] = f;
});

export function validateFormat(format, s) {
	if (typeof formats[format] !== 'function')
		throw new Error(`Unable to find format with name ${format}`);
	return formats[format](s);
}