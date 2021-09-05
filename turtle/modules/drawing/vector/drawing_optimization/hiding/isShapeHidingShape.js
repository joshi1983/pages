import { isCircleHidingArc } from './isCircleHidingArc.js';
import { isCircleHidingCircle } from './isCircleHidingCircle.js';
import { isPathHidingArc } from './isPathHidingArc.js';
import { isPathHidingCircle } from './isPathHidingCircle.js';
import { isPathHidingLine } from './isPathHidingLine.js';
import { isPathHidingPath } from './isPathHidingPath.js';

const isMap = new Map([
	['CircleShape_ArcShape', isCircleHidingArc],
	['CircleShape_CircleShape', isCircleHidingCircle],
	['PathShape_ArcShape', isPathHidingArc],
	['PathShape_CircleShape', isPathHidingCircle],
	['PathShape_LineSegmentShape', isPathHidingLine],
	['PathShape_PathShape', isPathHidingPath],
]);

export function isShapeHidingShape(hiderShape, hiddenShape) {
	const key = hiderShape.constructor.name + '_' + hiddenShape.constructor.name;
	const f = isMap.get(key);
	if (f !== undefined) {
		return f(hiderShape, hiddenShape);
	}
	return false;
};