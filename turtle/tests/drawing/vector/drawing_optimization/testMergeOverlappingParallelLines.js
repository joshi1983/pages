import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { mergeOverlappingParallelLines } from '../../../../modules/drawing/vector/drawing_optimization/mergeOverlappingParallelLines.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function createLineFromPoints(points) {
	return new LineSegmentShape(points[0], points[1]);
}

export function testMergeOverlappingParallelLines(logger) {
	const cases = [
		{
			'points': [
				[new Vector3D(0, 0, 0), new Vector3D(0, 1, 0)],
				[new Vector3D(0, 0, 0), new Vector3D(1, -1, 0)]
			],
			'isUndefined': true
		},
		{
			'points': [
				[new Vector3D(0, 0, 0), new Vector3D(0, 1, 0)],
				[new Vector3D(1, 0, 0), new Vector3D(1, -1, 0)]
			],
			'isUndefined': true
		},
		{
			'points': [
				[new Vector3D(0, 0, 0), new Vector3D(0, 1, 0)],
				[new Vector3D(0, 0, 0), new Vector3D(0, -1, 0)]
			],
			'isUndefined': false
		},
		{
			'points': [
				[new Vector3D(0, -2, 0), new Vector3D(0, 10, 0)],
				[new Vector3D(0, 0, 0), new Vector3D(0, -1, 0)]
			],
			'isUndefined': false
		},
		{
			'points': [
				[new Vector3D(-2, 0, 0), new Vector3D(10, 0, 0)],
				[new Vector3D(0, 0, 0), new Vector3D(-1, 0, 0)]
			],
			'isUndefined': false
		},
		{
			'points': [
				[new Vector3D(0, 0, 0), new Vector3D(1, 2, 0)],
				[new Vector3D(0, 0, 0), new Vector3D(-2, -4, 0)]
			],
			'isUndefined': false
		},
	];
	cases.forEach(function(caseInfo, index) {
		const line1 = createLineFromPoints(caseInfo.points[0]);
		const line2 = createLineFromPoints(caseInfo.points[1]);
		const result = mergeOverlappingParallelLines(line1, line2);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if ((result === undefined) !== caseInfo.isUndefined)
			plogger(`Expected isUndefined of ${caseInfo.isUndefined} but got ${result}`);
	});
};