import { ArrayUtils } from '../../../ArrayUtils.js';
import { isNumber } from '../../../isNumber.js';
import { shape } from './shape-conversion/shape.js';

export function drawingToLineSegments(drawing, degreesPerArcDivision) {
	if (!isNumber(degreesPerArcDivision))
		throw new Error(`degreesPerArcDivision expected to be a number but specified was ${degreesPerArcDivision}`);
	const shapes = drawing.getShapesArray();
	const result = [];
	for (let i = 0; i < shapes.length; i++) {
		ArrayUtils.pushAll(result, shape(shapes[i], degreesPerArcDivision));
	}
	return result;
};