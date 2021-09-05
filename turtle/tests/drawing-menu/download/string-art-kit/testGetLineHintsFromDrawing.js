import { BoundingBox2D } from '../../../../modules/drawing/vector/BoundingBox2D.js';
import { createTestDrawingForStringArt } from './createTestDrawingForStringArt.js';
import { sanitizePointsCloserThanThreshold } from '../../../../modules/drawing-menu/download/string-art-kit/sanitizePointsCloserThanThreshold.js';
import { getDistinctPointsFromDrawing } from '../../../../modules/drawing-menu/download/string-art-kit/getDistinctPointsFromDrawing.js';
import { getLineHintsFromDrawing } from '../../../../modules/drawing-menu/download/string-art-kit/getLineHintsFromDrawing.js';
import { LineHint } from '../../../../modules/drawing-menu/download/string-art-kit/LineHint.js';

export function testGetLineHintsFromDrawing(logger) {
	const drawing = createTestDrawingForStringArt();
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
};