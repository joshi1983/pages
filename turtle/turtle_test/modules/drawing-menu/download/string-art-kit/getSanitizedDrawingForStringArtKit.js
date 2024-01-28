import { Vector2DDrawing } from '../../../drawing/vector/Vector2DDrawing.js';

/*
A drawing might contain details so small that they're barely visible 
and won't be suitable for a string art kit.
This function filters those extremely tiny shapes out.
*/
export function getSanitizedDrawingForStringArtKit(drawing) {
	const originalBoundingBox = drawing.getBoundingBox();
	const averageSize = originalBoundingBox.getAverageX() + originalBoundingBox.getAverageY();
	const threshold = averageSize * 0.005; 
	// Anything smaller than 0.5% of average size will be filtered out.
	const filteredShapes = drawing.getShapesArray().
		filter(function(shape) {
			const box = shape.getBoundingBox();
			return box.getMaxDimensionSize() >= threshold;
		});
	const result = new Vector2DDrawing();
	result.addForegroundShapes(filteredShapes, false);
	return result;
};