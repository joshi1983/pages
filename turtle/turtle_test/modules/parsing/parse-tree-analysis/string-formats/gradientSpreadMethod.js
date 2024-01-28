/*
These are methods listed at:
https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/spreadMethod
*/
import { SpreadMethod } from '../../../drawing/vector/shapes/gradients/SpreadMethod.js';
const spreadMethods = SpreadMethod.getNames();

export function gradientSpreadMethod(s) {
	s = s.trim().toLowerCase();
	if (spreadMethods.indexOf(s) === -1)
		return `Unsupported spread method "${s}".  The spread method must be one of ${spreadMethods.join(',')}`;
};