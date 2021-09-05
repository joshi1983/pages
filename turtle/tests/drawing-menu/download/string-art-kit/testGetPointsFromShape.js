import { getPointsFromShape } from '../../../../modules/drawing-menu/download/string-art-kit/getPointsFromShape.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testGetPointsFromShape(logger) {
	const cases = [
		{
			'shape': new LineSegmentShape(new Vector3D(0, 0, 0), new Vector3D(0, 100, 0)),
			'numPoints': 2
		},
		{
			'shape': new PathShape([
				new Vector3D(0, 0, 0),
				new Vector3D(0, 100, 0),
				new Vector3D(100, 0, 0)
			], false),
			'numPoints': 3
		},
		{
			'shape': new PathShape([
				new Vector3D(0, 0, 0),
				new Vector3D(0, 100, 0),
				new Vector3D(100, 0, 0)
			], true), // closed shouldn't change the result.
			'numPoints': 3
		}
	];
	cases.forEach(function(caseInfo, index) {
		const points = getPointsFromShape(caseInfo.shape);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (points.length !== caseInfo.numPoints)
			plogger(`Expected ${caseInfo.numPoints} but got ${points.length}`);
		for (let i = 0; i < points.length; i++) {
			const point = points[i];
			if (!(point instanceof Vector2D))
				plogger(`Expected nothing but Vector2D elements in the result from getPointsFromShape but found something else at index ${i}`);
		}
	});
};