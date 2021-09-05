import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { isPathHidingArc } from
'../../../../../modules/drawing/vector/drawing_optimization/hiding/isPathHidingArc.js';
import { PathShape } from
'../../../../../modules/drawing/vector/shapes/PathShape.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testIsPathHidingArc(logger) {
	const pos = new Vector3D(1, 2, 3);
	const radius = 10;
	const a = new ArcShape(pos, 0, radius, 1);
	const cases = [{
		'inArgs': [new PathShape([pos, a], false), a], 'out': true
	}, {
		'inArgs': [new PathShape([pos, new Vector3D(10, 0, 0)], false), a], 'out': false
	}];
	testInOutPairs(cases, isPathHidingArc, logger);
};