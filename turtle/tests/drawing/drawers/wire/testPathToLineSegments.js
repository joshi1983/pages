import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { pathToLineSegments } from '../../../../modules/drawing/drawers/wire/pathToLineSegments.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function testWithOnlyVectors(logger) {
	const elements = [
		new Vector3D(0, 0, 0),
		new Vector3D(100, 50, 0),
		new Vector3D(-50, 70, 100)
	];
	const path = new PathShape(elements, false);
	const lines = pathToLineSegments(path);
	if (!(lines instanceof Array))
		logger('lines expected to be an Array but got ' + lines);
	else if (lines.length !== 2)
		logger(`Expected 2 line segments to represent the path but got ${lines.length}`);
}

function testPathWithArcs(logger) {
	const elements = [
		new Vector3D(0, 0, 0),
		new Vector3D(100, 50, 0),
		new Vector3D(-50, 70, 100),
		new ArcShape(new Vector3D(0, 0, 0), 0, 100, Math.PI)
	];
	const path = new PathShape(elements, false);
	const lines = pathToLineSegments(path);
	if (!(lines instanceof Array))
		logger('lines expected to be an Array but got ' + lines);
	else if (lines.length < 4)
		logger(`Expected at least 4 line segments to represent the path but got ${lines.length}`);
}

export function testPathToLineSegments(logger) {
	testWithOnlyVectors(prefixWrapper('testWithOnlyVectors', logger));
	testPathWithArcs(prefixWrapper('testPathWithArcs', logger));
};