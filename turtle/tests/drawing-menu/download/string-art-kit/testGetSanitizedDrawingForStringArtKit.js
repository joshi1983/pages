import { createTestDrawingForStringArt } from './createTestDrawingForStringArt.js';
import { getSanitizedDrawingForStringArtKit } from '../../../../modules/drawing-menu/download/string-art-kit/getSanitizedDrawingForStringArtKit.js';
import { VectorDrawing } from '../../../../modules/drawing/vector/VectorDrawing.js';

export function testGetSanitizedDrawingForStringArtKit(logger) {
	const drawing = createTestDrawingForStringArt();
	const sanitizedDrawing = getSanitizedDrawingForStringArtKit(drawing);
	if (!(sanitizedDrawing instanceof VectorDrawing))
		logger('Expected an instance of VectorDrawing but got ' + sanitizedDrawing);
};