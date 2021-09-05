import { isPathHidingPath } from '../../../../../modules/drawing/vector/drawing_optimization/hiding/isPathHidingPath.js';
import { PathShape } from '../../../../../modules/drawing/vector/shapes/PathShape.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';

export function testIsPathHidingPath(logger) {
	const cases = [{
		'inArgs': [new PathShape([
			new Vector3D(0, 0, 0), new Vector3D(10, 0, 0), new Vector3D(10, 10, 0)
		], true), new PathShape([
			new Vector3D(0, 0, 0), new Vector3D(10, 0, 0), new Vector3D(10, 10, 0)
		], false)],
		'out': true
	}];
	testInOutPairs(cases, isPathHidingPath, logger);
};