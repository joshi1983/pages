import { ColouredLineSegment } from
'../ColouredLineSegment.js';
import { getAverageColour } from
'../getAverageColour.js';

export function lineSegment(lineSegmentShape) {
	return new ColouredLineSegment(lineSegmentShape.position,
		lineSegmentShape.endPoint, getAverageColour(lineSegmentShape));
};