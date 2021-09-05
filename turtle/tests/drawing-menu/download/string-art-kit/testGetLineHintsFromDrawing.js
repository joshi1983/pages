import { BoundingBox2D } from '../../../../modules/drawing/vector/BoundingBox2D.js';
import { create3DLineDrawing } from '../../../helpers/create3DLineDrawing.js';
import { createTestDrawingForStringArt } from './createTestDrawingForStringArt.js';
import { sanitizePointsCloserThanThreshold } from '../../../../modules/drawing-menu/download/string-art-kit/sanitizePointsCloserThanThreshold.js';
import { getDistinctPointsFromDrawing } from '../../../../modules/drawing-menu/download/string-art-kit/getDistinctPointsFromDrawing.js';
import { getLineHintsFromDrawing } from '../../../../modules/drawing-menu/download/string-art-kit/getLineHintsFromDrawing.js';
import { LineHint } from '../../../../modules/drawing-menu/download/string-art-kit/LineHint.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { VectorDrawing } from '../../../../modules/drawing/vector/VectorDrawing.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testBasicCases(logger) {
	const drawings = [
		create3DLineDrawing(),
		createTestDrawingForStringArt()
	];
	for (const drawing of drawings) {
		let points = getDistinctPointsFromDrawing(drawing);
		const boundingBox = new BoundingBox2D([points]);
		const minSeparation = boundingBox.getAverageDimension() * 0.001;
		points = sanitizePointsCloserThanThreshold(points, minSeparation);
		const lineHints = getLineHintsFromDrawing(drawing, points, minSeparation);
		if (!(lineHints instanceof Array))
			logger(`Expected an Array but got ${lineHints}`);
		else if (lineHints.length === 0)
			logger(`Expected at least 1 LineHint but got none`);
		else if (!(lineHints[0] instanceof LineHint))
			logger(`Expected lineHints to be filled with LineHint instances but got ${lineHints[0]} at index 0`);
	}
}

function testClosedPath(logger) {
	const drawing = new VectorDrawing();
	const elements = [new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), new Vector3D(100, 100, 0)];
	const path = new PathShape(elements, true);
	drawing.addForegroundShape(path);
	let points = getDistinctPointsFromDrawing(drawing);
	if (points.length !== 3)
		logger(`Expected to find 3 distinct points but got ${points.length}`);
	const minSeparation = 0.01;
	points = sanitizePointsCloserThanThreshold(points, minSeparation);
	const lineHints = getLineHintsFromDrawing(drawing, points, minSeparation);
	if (lineHints.length !== 3)
		logger(`Expected 3 line hints for closed triangular path but got ${lineHints}`);
}

export function testGetLineHintsFromDrawing(logger) {
	wrapAndCall([
		testBasicCases,
		testClosedPath
	], logger);
};