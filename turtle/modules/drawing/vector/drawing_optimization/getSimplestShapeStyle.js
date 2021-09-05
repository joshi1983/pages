import { ArcShape } from '../shapes/ArcShape.js';
import { CircleShape } from '../shapes/CircleShape.js';
import { EllipseShape } from '../shapes/EllipseShape.js';
import { EllipseArcShape } from '../shapes/EllipseArcShape.js';
import { LineCap } from '../shapes/style/LineCap.js';
import { LineJoinStyle } from '../shapes/style/LineJoinStyle.js';
import { LineSegmentShape } from '../shapes/LineSegmentShape.js';
import { PathShape } from '../shapes/PathShape.js';
import { RasterRectangleShape } from '../shapes/RasterRectangleShape.js';

function lineCapMattersFor(shape) {
	if (!shape.style.isPenVisible())
		return false;
	if ((shape instanceof CircleShape) || (shape instanceof EllipseShape) ||
	(shape instanceof PathShape && shape.isClosed) ||
	(shape instanceof RasterRectangleShape)) {
		return false;
	}
	return true;
}

function lineJoinStyleMattersFor(shape, isOptimizingCompleteDrawing) {
	if (!shape.style.isPenVisible())
		return false;
	if ((shape instanceof CircleShape) || (shape instanceof EllipseShape) ||
	(shape instanceof RasterRectangleShape))
		return false;
	if (isOptimizingCompleteDrawing) {
		if (shape instanceof LineSegmentShape || shape instanceof ArcShape ||
		shape instanceof EllipseArcShape)
			return false;
	}
	return true;
}

function miterLimitMattersFor(shape, isOptimizingCompleteDrawing) {
	if (!lineJoinStyleMattersFor(shape, isOptimizingCompleteDrawing))
		return false;
	if (shape.style.getLineJoinStyle() !== LineJoinStyle.Miter)
		return false;
	return true;
}

export function getSimplestShapeStyle(shape, isOptimizingCompleteDrawing) {
	if (typeof isOptimizingCompleteDrawing !== 'boolean')
		throw new Error(`isOptimizingCompleteDrawing must be boolean but got ${isOptimizingCompleteDrawing}`);
	const result = shape.style.deepClone();
	if (shape instanceof RasterRectangleShape)
		result.setPenWidth(0);
	if (!lineCapMattersFor(shape)) {
		result.setLineCap(LineCap.Butt);
	}
	if (!miterLimitMattersFor(shape, isOptimizingCompleteDrawing)) {
		result.setMiterLimit(10); // the default miter limit
	}
	if (!shape.style.isPenVisible()) {
		result.setPenWidth(0);
		if (result.getPenGradient() !== undefined)
			result.setPenGradient(undefined);
	}
	if (!lineJoinStyleMattersFor(shape, isOptimizingCompleteDrawing)) {
		result.setLineJoinStyle(LineJoinStyle.Miter);
	}
	return result;
};