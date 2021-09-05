import { ArcShape } from '../shapes/ArcShape.js';
import { LineSegmentShape } from '../shapes/LineSegmentShape.js';
import { mergeArcs } from './mergeArcs.js';
import { mergeLines } from './mergeLines.js';
import { mergeLineWithArc } from './mergeLineWithArc.js';
import { mergePathWithArc } from './mergePathWithArc.js';
import { mergePathWithLine } from './mergePathWithLine.js';
import { mergePathWithPath } from './mergePathWithPath.js';
import { PathShape } from '../shapes/PathShape.js';
import { Shape } from '../shapes/Shape.js';
import { Transparent } from '../../../Transparent.js';

function isStylePolylineCompatible(style1, style2) {
	const style1FillGradient = style1.getFillGradient();
	const style2FillGradient = style2.getFillGradient();
	if ((style1FillGradient === undefined) !== (style2FillGradient === undefined))
		return false;
	else if (style1FillGradient !== undefined && !style1FillGradient.equals(style2FillGradient))
		return false;
	if (style1FillGradient === undefined && !style1.getFillColor().equals(style2.getFillColor()))
		return false;
	const style1PenGradient = style1.getPenGradient();
	const style2PenGradient = style2.getPenGradient();
	if ((style1PenGradient === undefined) !== (style2PenGradient === undefined))
		return false;
	else if (style1PenGradient !== undefined && !style1PenGradient.equals(style2PenGradient))
		return false;
	if (style1PenGradient === undefined && !style1.getPenColor().equals(style2.getPenColor()))
		return false;
	if (style1.getLineCap() !== style2.getLineCap())
		return false;
	if (style1.getMiterLimit() !== style2.getMiterLimit())
		return false;
	return style1.getPenWidth() === style2.getPenWidth() &&
		style1.getPenColor().equals(style2.getPenColor());
}

export function mergeShapes(shape1, shape2) {
	if (!(shape1 instanceof Shape))
		throw new Error('shape1 must be a shape.  Not: ' + shape1);
	if (!(shape2 instanceof Shape))
		throw new Error('shape2 must be shape.  Not: ' + shape2);
	if (shape1 instanceof PathShape && shape1.isClosed)
		return;
	if (shape2 instanceof PathShape && shape2.isClosed)
		return;
	// prevent bugs that sometimes happen when trying to merge an arc that is before a path.
	if (shape1 instanceof ArcShape && shape2 instanceof PathShape)
		return;
	if (isStylePolylineCompatible(shape1.style, shape2.style)) {
		if (shape1 instanceof LineSegmentShape && shape2 instanceof LineSegmentShape)
			return mergeLines(shape1, shape2);
		if (shape2 instanceof PathShape || shape1 instanceof ArcShape) {
			// swap.
			const temp = shape1;
			shape1 = shape2;
			shape2 = temp;
		}
		if (shape1 instanceof PathShape) {
			if (shape2 instanceof ArcShape) {
				if (shape1.style.getFillColor() === Transparent)
					return mergePathWithArc(shape1, shape2);
			}
			else if (shape2 instanceof LineSegmentShape) {
				if (shape1.style.getFillColor() === Transparent)
					return mergePathWithLine(shape1, shape2);
			}
			else if (shape2 instanceof PathShape) {
				return mergePathWithPath(shape1, shape2);
			}
		}
		else if (shape1.style.getFillColor() === Transparent) {
			if (shape2 instanceof ArcShape) {
				if (shape1 instanceof ArcShape)
					return mergeArcs(shape1, shape2);
				else if (shape1 instanceof LineSegmentShape)
					return mergeLineWithArc(shape1, shape2);
			}
		}
	}
};