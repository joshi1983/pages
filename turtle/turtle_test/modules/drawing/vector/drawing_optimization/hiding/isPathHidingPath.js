import { ArcShape } from '../../shapes/ArcShape.js';
import { getEnd } from './getEnd.js';
import { getStart } from './getStart.js';
import { isPathHidingArc } from './isPathHidingArc.js';
import { isPathHidingLine } from './isPathHidingLine.js';
import { LineSegmentShape } from '../../shapes/LineSegmentShape.js';
import { mightStrokeOverlap } from './mightStrokeOverlap.js';
import { Vector3D } from '../../Vector3D.js';

export function isPathHidingPath(largePath, smallPath) {
	if (smallPath.isClosed)
		return false; 
		// can't be sure the filled parts are completely hidden with this code yet.
	if (!mightStrokeOverlap(largePath, smallPath))
		return false;

	const elements = smallPath.elements;
	// Look for any element in smallPath not being hidden by largePath.
	for (let i = 0; i < elements.length; i++) {
		const e = elements[i];
		if (e instanceof ArcShape) {
			if (!isPathHidingArc(largePath, e))
				return false;
		}
		if (i > 0) {
			const fromPos = getEnd(elements[i - 1]);
			const toPos = getStart(elements[i]);
			if (!fromPos.equals(toPos)) {
				const lineSegment = new LineSegmentShape(fromPos, toPos, smallPath.style);
				if (!isPathHidingLine(largePath, lineSegment))
					return false;
			}
		}
	}
	return true;
};