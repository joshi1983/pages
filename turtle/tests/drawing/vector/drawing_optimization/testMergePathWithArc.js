import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { mergePathWithArc } from '../../../../modules/drawing/vector/drawing_optimization/mergePathWithArc.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function mergePathWithArc1(logger) {
	const p1 = new Vector3D(1, 2, 3);
	const p2 = new Vector3D(3, -4, -5);
	const pline = new PathShape([p1, p2], false);
	const arc = new ArcShape(p2.plus(new Vector3D(0, 10, 0)), 0, 10, Math.PI);
	const result = mergePathWithArc(pline, arc);
	if (!(result instanceof PathShape))
		logger('PathShape expected but got ' + result);
}

function mergePathWithArcZeroAngle(logger) {
	const p1 = new Vector3D(1, 2, 3);
	const p2 = new Vector3D(0, 0, 0);
	const pline = new PathShape([p1, p2], false);
	const arc = new ArcShape(p2.plus(new Vector3D(0, 10, 0)), 0, 10, 0);
	const result = mergePathWithArc(pline, arc);
	if (!(result instanceof PathShape))
		logger('PathShape expected but got ' + result);
	else if (result.elements.length !== 2)
		logger(`Expected result.elements.length to be 2 but got ${result.elements.length}`);
}

export function testMergePathWithArc(logger) {
	wrapAndCall([
		mergePathWithArc1,
		mergePathWithArcZeroAngle
	], logger);
};