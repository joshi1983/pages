import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { mergeLines } from '../../../../modules/drawing/vector/drawing_optimization/mergeLines.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testMergeLines(logger) {
	const points = [new Vector3D(1, 2, 3), new Vector3D(4, 5, 6), new Vector3D(-1, -4, 3), new Vector3D(18, -23, -34)];
	const cases = [
		{'indexes': [0, 1, 2, 3], 'isResultDefined': false},
		{'indexes': [0, 1, 1, 3], 'isResultDefined': true},
		{'indexes': [1, 0, 0, 3], 'isResultDefined': true},
		{'indexes': [0, 1, 2, 1], 'isResultDefined': true},
		{'indexes': [0, 1, 2, 0], 'isResultDefined': true},
	];
	cases.forEach(function(caseInfo) {
		const line1 = new LineSegmentShape(points[caseInfo.indexes[0]], points[caseInfo.indexes[1]]);
		const line2 = new LineSegmentShape(points[caseInfo.indexes[2]], points[caseInfo.indexes[3]]);
		const result = mergeLines(line1, line2);
		if (caseInfo.isResultDefined !== (result !== undefined))
			logger(`Expected is result defined of ${caseInfo.isResultDefined} but got ${result !== undefined}`);
	});
};