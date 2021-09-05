import { createTestDrawingForStringArt } from './createTestDrawingForStringArt.js';
import { getDistinctPointsFromDrawing } from '../../../../modules/drawing-menu/download/string-art-kit/getDistinctPointsFromDrawing.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';
import { Vector2DDrawing } from '../../../../modules/drawing/vector/Vector2DDrawing.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testBasic(logger) {
	const drawing = createTestDrawingForStringArt();
	const points = getDistinctPointsFromDrawing(drawing);
	if (!(points instanceof Array))
		logger('Expected an Array but got something else: ' + points);
	else {
		if (points.length === 0)
			logger('Expected there to be at least 1 point but got none');
		for (let i = 0; i < points.length; i++) {
			if (!(points[i] instanceof Vector2D))
				logger(`Every element in the Array expected to be a Vector2D but found something else at index ${i}.  Element = ${points[i]}`);
		}
	}
}

function testDuplicatePointsRemoved(logger) {
	const drawing = new Vector2DDrawing();
	for (let i = 0; i < 5; i++) {
		const from = new Vector3D(0, 0, 0);
		const to = new Vector3D(1, 2, 3);
		const lineSegment = new LineSegmentShape(from, to);
		drawing.addForegroundShape(lineSegment);
	}
	const points = getDistinctPointsFromDrawing(drawing);
	if (points.length !== 2)
		logger(`Expected 2 distinct points but got ${points.length}`);
}

export function testGetDistinctPointsFromDrawing(logger) {
	wrapAndCall([
		testBasic,
		testDuplicatePointsRemoved
	], logger);
};