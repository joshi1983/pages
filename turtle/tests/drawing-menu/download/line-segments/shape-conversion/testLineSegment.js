import { LineSegmentShape } from
'../../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { lineSegment } from
'../../../../../modules/drawing-menu/download/line-segments/shape-conversion/lineSegment.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testLineSegment(logger) {
	const cases = [
	{
		'lineSegmentShape': new LineSegmentShape(new Vector3D(0, 0, 0), new Vector3D(100, 200, 0)),
	}
	];
	cases.forEach(function(caseInfo) {
		const result = lineSegment(caseInfo.lineSegmentShape);
	});
};