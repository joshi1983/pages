import { ArcShape } from '../../shapes/ArcShape.js';
import { isArcHidingArc } from './isArcHidingArc.js';
import { LineCap } from '../../shapes/style/LineCap.js';
import { LineJoinStyle } from '../../shapes/style/LineJoinStyle.js';
import { mightStrokeOverlap } from './mightStrokeOverlap.js';
import { Vector } from '../../Vector.js';

function isPathStrokeHidingArc(path, arc) {
	let len = Math.max(0.1, arc.radius * arc.angle);
	const errorThreshold = len * 0.000001;
	const elements = path.elements;
	const end = arc.getEndPoint();
	const start = arc.getStartPoint();
	for (let i = 0; i < elements.length; i++) {
		const e = elements[i];
		if (!(e instanceof ArcShape))
			continue;
		if (isArcHidingArc(e, arc)) {
			if (elements.length === 1 && path.isClosed === false)
					return true; // if path is nothing more than the 
						// contained e(an arc), e hides arc implies path hides arc.

			if (arc.style.getLineCap() === LineCap.Butt)
				return true; // if the arc has no line caps, 
				// e hides arc implies the path containing e hides arc.

			if (path.style.getLineCap() === LineCap.Square) {
				// FIXME: do more thorough check that the line caps of arc are overlapped by joins and neighbours of e.
				return true;
			}
			if (arc.style.getLineCap() === LineCap.Round) {
				if (path.style.getLineJoinStyle() === LineJoinStyle.Round && i !== 0 && i !== elements.length - 1)
					return true;

				if (path.style.getLineCap() === LineCap.Round)
					return true;
			}
			// FIXME: check if neighbouring shapes and line joins can hide arc's line caps.
			return true;
		}
	}
	return false;
}

export function isPathHidingArc(path, arc) {
	if (!mightStrokeOverlap(path, arc))
		return false;

	return isPathStrokeHidingArc(path, arc);
};