import { Colour } from '../../../Colour.js';
import { Transparent } from '../../../Transparent.js';
import { Vector2DDrawing } from '../../../drawing/vector/Vector2DDrawing.js';

export function removeScreenColor(drawing) {
	if (drawing.getScreenColor() === Transparent || drawing.getScreenColor().equals(Colour.WHITE))
		return drawing;
	const result = new Vector2DDrawing();
	result.addForegroundShapes(drawing.getShapesArray());
	return result;
};