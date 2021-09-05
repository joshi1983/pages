import { create3DLineDrawing } from
'../../../helpers/create3DLineDrawing.js';
import { createTestDrawingForStringArt } from './createTestDrawingForStringArt.js';
import { drawingToStringArtKitDrawing } from '../../../../modules/drawing-menu/download/string-art-kit/drawingToStringArtKitDrawing.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testDrawingToStringArtKitDrawing(logger) {
	const optionsArray = [
		{'lineHints': false},
		{'lineHints': true}
	];
	const drawings = [
		create3DLineDrawing(),
		createTestDrawingForStringArt(),
	];
	optionsArray.forEach(function(options, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		for (const drawing of drawings) {
			const stringArtKitDrawing = drawingToStringArtKitDrawing(drawing, options);
			const shapes = stringArtKitDrawing.getShapesArray();
			if (shapes.length === 0)
				plogger(`Expected at least 1 shape but got none`);
		}
	});
};