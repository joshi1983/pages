import { createTestDrawingForStringArt } from './createTestDrawingForStringArt.js';
import { getSanitizedDrawingForStringArtKit } from '../../../../modules/drawing-menu/download/string-art-kit/getSanitizedDrawingForStringArtKit.js';
import { Vector2DDrawing } from '../../../../modules/drawing/vector/Vector2DDrawing.js';

export function testGetSanitizedDrawingForStringArtKit(logger) {
	const drawing = createTestDrawingForStringArt();
	const sanitizedDrawing = getSanitizedDrawingForStringArtKit(drawing);
	if (!(sanitizedDrawing instanceof Vector2DDrawing))
		logger('Expected an instance of Vector2DDrawing but got ' + sanitizedDrawing);
};