import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { isArcHidingCircleGeometry } from
'../../../../../modules/drawing/vector/drawing_optimization/hiding/isArcHidingCircleGeometry.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testIsArcHidingCircleGeometry(logger) {
	const arc1 = new ArcShape(new Vector3D(0, 0, 0), 0, 5, 1);
	const cases = [
		{
			'inArgs': [arc1, [0, 0, 0], 1], 'out': false
		},
		{
			'inArgs': [arc1, [1, 0, 0], 1], 'out': false
		},
		{
			'inArgs': [arc1, [0, 3, 0], 1], 'out': false
		},
		{
			'inArgs': [arc1, [0, 6, 0], 1], 'out': false
		}
	];
	testInOutPairs(cases, isArcHidingCircleGeometry, logger);
};