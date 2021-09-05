import { getAverageColour } from
'../../../../modules/drawing-menu/download/line-segments/getAverageColour.js';
import { LineSegmentShape } from
'../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { Vector3D } from
'../../../../modules/drawing/vector/Vector3D.js';

function wrappedGetAverageColour(lineSegment) {
	return getAverageColour(lineSegment).toString();
}

export function testGetAverageColour(logger) {
	const cases = [
	{'in': new LineSegmentShape(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0)),
	'out': '#000000'}
	];
	testInOutPairs(cases, wrappedGetAverageColour, logger);
};