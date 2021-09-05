import { isPathHidingArc } from './isPathHidingArc.js';
import { isPathHidingLine } from './isPathHidingLine.js';
import { isPathHidingPath } from './isPathHidingPath.js';

const isMap = new Map([
	['PathShape_ArcShape', isPathHidingArc],
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