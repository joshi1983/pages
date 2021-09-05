import { mergeOverlappingParallelLines } from './mergeOverlappingParallelLines.js';
import { PathShape } from '../shapes/PathShape.js';

// assumes line1 and line2 have compatible shape style for merging
// For example, equal pen width along with equal pen color or gradient
export function mergeLines(line1, line2) {
	if (line1.preventPathJoin === true)
		return; // do not join.
	const lineResult = mergeOverlappingParallelLines(line1, line2);
	if (lineResult !== undefined)
		return lineResult;
	if (line1.position.equals(line2.position)) {
		line1.swapEndPoints();
	}
	else if (line1.endPoint.equals(line2.endPoint)) {
		line2.swapEndPoints();
	}
	else if (line2.endPoint.equals(line1.position)) {
		const temp = line1;
		line1 = line2;
		line2 = temp;
	}
	if (line1.endPoint.equals(line2.position)) {
		const points = [
			line1.position,
			line1.endPoint,
			line2.endPoint
		];
		const style = line1.style.deepClone();
		style.clearFill();
		return new PathShape(points, false, style);
	}
};