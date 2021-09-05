import { prefixWrapper } from '../../prefixWrapper.js';
import { validateShapeGeneric } from './shapes/validateShapeGeneric.js';

export function validateVectorDrawing(drawing, logger) {
	const shapes = drawing.getShapesArray();
	shapes.forEach(function(shape, index) {
		validateShapeGeneric(shape, prefixWrapper(`shape ${index}`, logger));
	});
};