import { ArrayUtils } from '../../../ArrayUtils.js';
import { PathShape } from '../shapes/PathShape.js';

export function mergePathWithPath(pline1, pline2) {
	if (pline1.getStartPoint().equals(pline2.getEndPoint())) {
		// swap
		const temp = pline1;
		pline1 = pline2;
		pline2 = temp;
	}
	if (pline1.getEndPoint().equals(pline2.getStartPoint())) {
		const newPoints = pline1.elements.slice(0);
		ArrayUtils.pushAll(newPoints, pline2.elements);
		return new PathShape(newPoints, false, pline1.style);
	}
};