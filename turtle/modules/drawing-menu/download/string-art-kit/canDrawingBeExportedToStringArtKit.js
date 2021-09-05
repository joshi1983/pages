import { CircleShape } from '../../../drawing/vector/shapes/CircleShape.js';
import { EllipseShape } from '../../../drawing/vector/shapes/EllipseShape.js';
import { getDistinctPointsFromDrawing } from './getDistinctPointsFromDrawing.js';
import { getSanitizedDrawingForStringArtKit } from './getSanitizedDrawingForStringArtKit.js';
import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../../drawing/vector/shapes/PathShape.js';
import { Transparent } from '../../../Transparent.js';

export function canDrawingBeExportedToStringArtKit(drawing) {
	// if anything other than LineShape and PathShape are in the drawing, return false.
	const shapes = getSanitizedDrawingForStringArtKit(drawing).getShapesArray();
	if (shapes.length === 0 || shapes.length > 2000) // too few or too many to lead to a useful kit
		return false;
	const boundingBox = drawing.getBoundingBox();
	const smallCircleCutOffRadius = boundingBox.getAverageDimensionXY() * 0.1;
	const nonLineShapes = shapes.filter(s => !(s instanceof LineSegmentShape) && !(s instanceof PathShape));
	const smallCircleShapes = nonLineShapes.filter(s => s instanceof CircleShape && s.radius < smallCircleCutOffRadius);
	if (nonLineShapes.length - smallCircleShapes.length > 10) // only a few big circles or ellipses at most should exist.
		return false;
	// shapes other than line segments and paths can't be drawn using strings.
	// circles and ellipses might help but only a few of them and only as guiding lines for the drawing.
	if (shapes.some(shape => !(shape instanceof LineSegmentShape) &&
	!(shape instanceof PathShape) && !(shape instanceof CircleShape) && !(shape instanceof EllipseShape)))
		return false;

	// There needs to be at least 1 line or path or the drawing is useless for string-art.
	if (!shapes.some(shape => (shape instanceof LineSegmentShape) || (shape instanceof PathShape)))
		return false;

	// if the drawing contains a path, it must not contain anything but points and it must not be filled.
	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];
		if (shape instanceof PathShape) {
			if (shape.style.getFillColor() !== Transparent || shape.style.getFillGradient() !== undefined)
				return false;
			if (shape.containsNonPoints())
				return false;
		}
	}

	// a last check to see if the complexity of the drawing is within a reasonable limit for a string art kit.
	if (getDistinctPointsFromDrawing(drawing).length > 3000)
		return false;

	return true;
};