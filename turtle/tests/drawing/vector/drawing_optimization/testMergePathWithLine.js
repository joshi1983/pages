import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { mergePathWithLine } from '../../../../modules/drawing/vector/drawing_optimization/mergePathWithLine.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function testBasicCases(logger) {
	const p1 = new Vector3D(1, 2, 3);
	const p2 = new Vector3D(3, -4, -5);
	const p3 = new Vector3D(5, 10, 20);
	const p4 = new Vector3D(-5, -10, 20);
	const points = [p1, p2, p3, p4];
	const path = new PathShape([p1, p2], false);
	const cases = [
		{'indexes': [1, 2], 'isResultDefined': true},
		{'indexes': [2, 1], 'isResultDefined': true},
		{'indexes': [0, 2], 'isResultDefined': true},
		{'indexes': [2, 3], 'isResultDefined': false},
	];
	cases.forEach(function(caseInfo, index) {
		const line = new LineSegmentShape(points[caseInfo.indexes[0]], points[caseInfo.indexes[1]]);
		const result = mergePathWithLine(path, line);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if ((result !== undefined) !== caseInfo.isResultDefined)
			plogger(`Expected result to be defined of ${caseInfo.isResultDefined} but got ${result}`);
	});
}

function testPathWithParallelLine1(logger) {
	const p1 = new Vector3D(0, 0, 0);
	const p2 = new Vector3D(1, 2, 3);
	const p3 = new Vector3D(2, 4, 6);
	const path = new PathShape([p1, p2], false);
	const line = new LineSegmentShape(p2, p3);
	const result = mergePathWithLine(path, line);
	if (!(result instanceof PathShape))
		logger('PathShape expected but got ' + result);
	else if (result.elements.length !== 2)
		logger(`PathShape elements.length expected to be 2 but got ${result.elements.length}`);
	else if (result.elements[1].getX() !== 2)
		logger(`PathShape elements[1].getX() expected to be 2 but got ${result.elements[1].getX()}`);
	else if (result.elements[1].getY() !== 4)
		logger(`PathShape elements[1].getY() expected to be 4 but got ${result.elements[1].getY()}`);
	else if (result.elements[1].getZ() !== 6)
		logger(`PathShape elements[1].getZ() expected to be 6 but got ${result.elements[1].getZ()}`);
	else if (result.elements[0].getX() !== 0)
		logger(`PathShape elements[0].getX() expected to be 0 but got ${result.elements[0].getX()}`);
}

function testPathWithParallelLine2(logger) {
	const p1 = new Vector3D(0, 0, 0);
	const p2 = new Vector3D(1, 2, 3);
	const p3 = new Vector3D(4, 4, 6);
	const p4 = new Vector3D(-2, -4, -6);
	const path = new PathShape([p1, p2, p3], false);
	const line = new LineSegmentShape(p1, p4);
	const result = mergePathWithLine(path, line);
	if (!(result instanceof PathShape))
		logger('PathShape expected but got ' + result);
	else if (result.elements.length !== 3)
		logger(`PathShape elements.length expected to be 3 but got ${result.elements.length}`);
	else if (result.elements[1].getX() !== 1)
		logger(`PathShape elements[1].getX() expected to be 1 but got ${result.elements[1].getX()}`);
	else if (result.elements[1].getY() !== 2)
		logger(`PathShape elements[1].getY() expected to be 2 but got ${result.elements[1].getY()}`);
	else if (result.elements[1].getZ() !== 3)
		logger(`PathShape elements[1].getZ() expected to be 3 but got ${result.elements[1].getZ()}`);
	else if (result.elements[0].getX() !== -2)
		logger(`PathShape elements[0].getX() expected to be -2 but got ${result.elements[0].getX()}`);
	else if (result.elements[0].getY() !== -4)
		logger(`PathShape elements[0].getY() expected to be -4 but got ${result.elements[0].getY()}`);
	else if (result.elements[0].getZ() !== -6)
		logger(`PathShape elements[0].getZ() expected to be -6 but got ${result.elements[0].getZ()}`);
}

export function testMergePathWithLine(logger) {
	testBasicCases(prefixWrapper('testBasicCases', logger));
	testPathWithParallelLine1(prefixWrapper('testPathWithParallelLine1', logger));
	testPathWithParallelLine2(prefixWrapper('testPathWithParallelLine2', logger));
};