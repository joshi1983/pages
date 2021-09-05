import { AlphaColour } from '../../../AlphaColour.js';
import { ArcShape } from '../../../drawing/vector/shapes/ArcShape.js';
import { CircleShape } from '../../../drawing/vector/shapes/CircleShape.js';
import { EllipseShape } from '../../../drawing/vector/shapes/EllipseShape.js';
import { Gradient } from '../../../drawing/vector/shapes/gradients/Gradient.js';
import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../../drawing/vector/shapes/PathShape.js';
import { Vector } from '../../../drawing/vector/Vector.js';

function usesAlphaBlending(shape) {
	const style = shape.style;
	if (style.getFillColor() instanceof AlphaColour)
		return true;
	if (style.isPenVisible() && style.getPenColor() instanceof AlphaColour)
		return true;
	return false;
}

function usesNonDefaultMiterLimit(shape) {
	if (['CircleShape', 'EllipseShape', 'LineSegmentShape'].some(name => shape.constructor.name === name))
		return false;
	if (!shape.style.isPenVisible())
		return false;
	const style = shape.style;
	if (style.getMiterLimit() === 10)
		return false;
	return true;
}

export function canDrawingBeExportedToPostScript(drawing) {
	const shapes = drawing.getShapesArray();
	if (shapes.length === 0) // we don't want to export empty drawings to PostScript.
		return false;
	// make sure the drawing contains only lineSegments and PathShapes.
	if (shapes.some(shape => !(shape instanceof LineSegmentShape) && 
	!(shape instanceof PathShape) && !(shape instanceof ArcShape) && !(shape instanceof CircleShape) && !(shape instanceof EllipseShape)))
		return false; // because no other shapes are supported for now.
	if (shapes.some(shape => (shape.style.getFillGradient() instanceof Gradient) || (shape.style.getPenGradient() instanceof Gradient)))
		return false; // because unable to make gradient
	if (shapes.some(usesAlphaBlending))
		return false;
	if (shapes.some(usesNonDefaultMiterLimit))
		return false;

	// Can't support rotated ellipses in PostScript yet.
	//if (shapes.some(shape => shape instanceof EllipseShape && shape.rotationRadians !== 0))
	//	return false;

	const pathShapes = shapes.filter(shape => shape instanceof PathShape);
	for (let i = 0; i < pathShapes.length; i++) {
		const pathShape = pathShapes[i];
		// only vectors are supported in paths for now.
		if (pathShape.elements.some(element => !(element instanceof Vector)))
			return false;
	}
	return true;
};