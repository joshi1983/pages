import { AlphaColour } from '../../../AlphaColour.js';
import { LineJoinStyle } from '../../vector/shapes/style/LineJoinStyle.js';
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

function usesUnsupportedMiterLimit(shape) {
	const miterLimit = shape.style.getMiterLimit();
	if (miterLimit === 0 || miterLimit === 10)
		return false; // 10 is default.  0 is drawn properly using bevel.
	if (!shape.style.isPenVisible())
		return false; // miterLimit has no effect when the pen isn't shown.
	if (shape.style.getLineJoinStyle() !== LineJoinStyle.Miter)
		return false; // miterLimit will have no effect unless lineJoinStyle is miter.
	if (shape instanceof PathShape || shape instanceof TextShape)
		return true;
	else
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
		if (usesUnsupportedMiterLimit(shape))
			return false;
	}
	return true;
};