import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { isArcHidingPoint } from
'../../../../../modules/drawing/vector/drawing_optimization/hiding/isArcHidingPoint.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testIsArcHidingPoint(logger) {
	const arc1 = new ArcShape(new Vector3D(0, 0, 0), 0, 5, Math.PI);
	const cases = [
		{'inArgs': [arc1, [0, 0, 0]], 'out': false},
		{'inArgs': [arc1, [6, 0, 0]], 'out': false},
	];
	testInOutPairs(cases, isArcHidingPoint, logger);
};