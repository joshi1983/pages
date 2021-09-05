import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { mergeArcs } from '../../../../modules/drawing/vector/drawing_optimization/mergeArcs.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function circleCases(logger) {
	// FIXME: add test cases
}

function expectArcResultCase(logger) {
	const p1 = new Vector3D(1, 2, 3);
	const arc1 = new ArcShape(p1, 0, 10, Math.PI / 2);
	const arc2 = new ArcShape(p1, Math.PI / 2, 10, Math.PI / 2);
	const result = mergeArcs(arc1, arc2);
	if (!(result instanceof ArcShape))
		logger('Expected a ArcShape but got ' + result);
	else {
		if (result.angle !== Math.PI)
			logger(`Expected the result.angle to be ${Math.PI} but got ${result.angle}`);
	}
}

function simpleCase(logger) {
	const p1 = new Vector3D(1, 2, 3);
	const arc1 = new ArcShape(p1.plus(new Vector3D(0, 10, 0)), 0, 10, Math.PI);
	const arc2 = new ArcShape(p1.plus(new Vector3D(0, -10, 0)), 0, 10, Math.PI);
	const result = mergeArcs(arc1, arc2);
	if (!(result instanceof PathShape))
		logger('Expected a PathShape but got ' + result);
	else if (result.elements.length !== 2)
		logger('Expected result to have 2 elements but got ' + result.elements.length);
	else if (!result.elements[0].getEndPoint().equalsCloseEnough(result.elements[1].getStartPoint()))
		logger('Expected the end of the first element to match the start of the second but got something else');
}

export function testMergeArcs(logger) {
	wrapAndCall([
		circleCases,
		expectArcResultCase,
		simpleCase
	], logger);
};