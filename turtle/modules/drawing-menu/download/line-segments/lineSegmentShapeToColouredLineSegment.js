import { ColouredLineSegment } from
'../../../../modules/drawing-menu/download/line-segments/ColouredLineSegment.js';
import { getAverageColour } from
'../../../../modules/drawing-menu/download/line-segments/getAverageColour.js';

export function lineSegmentShapeToColouredLineSegment(lineSegmentShape) {
	return new ColouredLineSegment(lineSegmentShape.position,
		lineSegmentShape.endPoint, getAverageColour(lineSegmentShape));
};