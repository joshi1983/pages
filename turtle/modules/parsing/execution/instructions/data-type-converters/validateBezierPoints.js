import { isNumber } from '../../../../isNumber.js';
import { LogoRuntimeException } from '../../LogoRuntimeException.js';
import { valueToString } from '../../../../valueToString.js';

export function getBezierPointsValidationMessage(points) {
	if (!(points instanceof Array))
		return 'points must be an Array.  Not: ' + points;
	if (points.length < 2)
		return `There must be at least 2 points for a bezier curve.  Not: ${points.length}`;
	const numDimensions = points[0].length;
	if (!Number.isInteger(numDimensions))
		return `points must be a list of points but the first element is not a list.  The first element is ${valueToString(points[0])}`;
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		if (!(p instanceof Array))
			return `Every element in points must be a list representing a point but at least one element is not a point.  The element is ${valueToString(p)}`;
		if (p.length !== numDimensions)
			return `Every point must have equal dimension.  At least 1 point has ${numDimensions} and at least one other has ${p.length}.`;
		for (let j = 0; j < numDimensions; j++) {
			if (!isNumber(p[j]))
				return `Every coordinate in every point must be a number.  Found "${valueToString(p[j])}"`;
		}
	}
};

export function validateBezierPoints(points) {
	const msg = getBezierPointsValidationMessage(points);
	if (msg !== undefined)
		throw new LogoRuntimeException(msg);
};
