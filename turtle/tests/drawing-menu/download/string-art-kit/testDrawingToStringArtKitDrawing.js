import { createTestDrawingForStringArt } from './createTestDrawingForStringArt.js';
import { drawingToStringArtKitDrawing } from '../../../../modules/drawing-menu/download/string-art-kit/drawingToStringArtKitDrawing.js';

export function testDrawingToStringArtKitDrawing(logger) {
	const drawing = createTestDrawingForStringArt();
	const stringArtKitDrawing = drawingToStringArtKitDrawing(drawing);
	const shapes = stringArtKitDrawing.getShapesArray();
};