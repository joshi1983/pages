import { arc } from './arc.js';
import { circle } from './circle.js';
import { lineSegment } from './lineSegment.js';
import { LineSegmentShape } from '../../../../drawing/vector/shapes/LineSegmentShape.js';
import { orientedCircle } from './orientedCircle.js';
import { path } from './path.js';
import { StringUtils } from '../../../../StringUtils.js';

const nameShapeFuncMap = new Map();
[arc, circle, orientedCircle, path].forEach(function(shapeFunc) {
	const name = StringUtils.capitalizeFirstLetter(shapeFunc.name) + 'Shape';
	nameShapeFuncMap.set(name, shapeFunc);
});

export function shape(shape, degreesPerArcDivision) {
	const shapeFunc = nameShapeFuncMap.get(shape.constructor.name);
	if (shapeFunc !== undefined)
		return shapeFunc(shape, degreesPerArcDivision);
	if (shape instanceof LineSegmentShape)
		return [lineSegment(shape)];
	const result = [];
	return result;
};