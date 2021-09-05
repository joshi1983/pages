import { Colour } from '../../../Colour.js';
import { Transparent } from '../../../Transparent.js';
import { VectorDrawing } from '../../../drawing/vector/VectorDrawing.js';

export function removeScreenColor(drawing) {
	if (drawing.getScreenColor() === Transparent || drawing.getScreenColor().equals(Colour.WHITE))
		return drawing;
	const result = new VectorDrawing();
	result.addForegroundShapes(drawing.getShapesArray());
	return result;
};