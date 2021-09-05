import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { mergeLineWithArc } from '../../../../modules/drawing/vector/drawing_optimization/mergeLineWithArc.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testMergeLineWithArc(logger) {
	const p1 = new Vector3D(1, 2, 3);
	const p2 = new Vector3D(3, -4, -5);
	const line = new LineSegmentShape(p1, p2);
	const arc = new ArcShape(p1.plus(new Vector3D(0, 10, 0)), 0, 10, Math.PI);
	const result = mergeLineWithArc(line, arc);
	if (!(result instanceof PathShape))
		logger('PathShape expected but got ' + result);
	if (result.elements.length !== 2) {
		logger('PathShape expected to have 2 elements but got ' + result.elements.length);
	}
};