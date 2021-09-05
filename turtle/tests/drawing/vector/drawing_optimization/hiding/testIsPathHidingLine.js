import { isPathHidingLine } from '../../../../../modules/drawing/vector/drawing_optimization/hiding/isPathHidingLine.js';
import { LineSegmentShape } from '../../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../../../../modules/drawing/vector/shapes/PathShape.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';

export function testIsPathHidingLine(logger) {
	const cases = [
	{'inArgs': [
		new PathShape([new Vector3D(1,2,0), new Vector3D(5,2,0)], false),
		new LineSegmentShape(new Vector3D(1,2,0), new Vector3D(5,2,0))
	], 'out': true},
	{'inArgs': [
		new PathShape([new Vector3D(1,2,0), new Vector3D(5,2,0)], false),
		new LineSegmentShape(new Vector3D(1,2,0), new Vector3D(105,2,0))
	], 'out': false},
	];
	testInOutPairs(cases, isPathHidingLine, logger);
};