import { AlphaColour } from '../../../AlphaColour.js';
import { PathShape } from '../../vector/shapes/PathShape.js';
import { TextShape } from '../../vector/shapes/TextShape.js';
import { Vector } from '../../vector/Vector.js';
await AlphaColour.asyncInit();

const drawableShapeTypes = new Set(['CircleShape', 'EllipseShape', 'LineSegmentShape', 'PathShape', 'TextShape']);

function isStrictlyVectors(elements) {
	return !elements.some(e => !(e instanceof Vector));
}

function styleUsesGradient(style) {
	if (style.isPenVisible() && style.getPenGradient() !== undefined)
		return true;
	else if (style.getFillGradient() !== undefined)
		return true;
	return false;
}

function styleUsesAlphaColors(style) {
	if (style.isPenVisible() && style.getPenGradient() === undefined && style.getPenColor() instanceof AlphaColour)
		return true;
	else if (style.getFillGradient() === undefined && style.getFillColor() instanceof AlphaColour)
		return true;
	return false;
}

function isDrawableShapeType(shape) {
	return drawableShapeTypes.has(shape.constructor.name);
}

function isRotated(shape) {
	if (shape instanceof TextShape)
		return false; // No problem rotating TextShape.
	if (shape.rotationRadians === undefined)
		return false;
	return shape.rotationRadians !== 0 &&
		shape.rotationRadians !== Math.PI / 2;
}

/*
Checks if the specified drawing can be converted to PDF without any errors.
*/
export function isDrawableToPDF(drawing) {
	const shapes = drawing.getShapesArray();
	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];
		if (!isDrawableShapeType(shape))
			return false;
		if (shape instanceof PathShape) {
			if (!isStrictlyVectors(shape.elements))
				return false;
		}
		if (styleUsesGradient(shape.style))
			return false;
		if (styleUsesAlphaColors(shape.style))
			return false;
		if (isRotated(shape))
			return false;
	}
	return true;
};