import { getEnd } from '../../../drawing/vector/drawing_optimization/hiding/getEnd.js';
import { getStart } from '../../../drawing/vector/drawing_optimization/hiding/getStart.js';
import { isNumber } from '../../../isNumber.js';
import { LineHint } from './LineHint.js';
import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../../drawing/vector/shapes/PathShape.js';
import { Vector2DQuadTree } from '../../../drawing/vector/Vector2DQuadTree.js';

export function getLineHintsFromDrawing(drawing, distinctPoints, threshold) {
	if (!(distinctPoints instanceof Array))
		throw new Error('distinctPoints must be an Array');
	if (!isNumber(threshold) || threshold <= 0)
		throw new Error('threshold must be a positive number.  Not: ' + threshold);

	const quadTree = new Vector2DQuadTree(distinctPoints);
	function pToV2D(p) {
		return quadTree.getVectorClosestTo(p, threshold);
	}
	function getLineHintFromClosedPath(shape) {
		if (shape.isClosed !== true)
			return; // no line hint.
		const elements = shape.elements;
		const fromP = pToV2D(getEnd(elements[elements.length - 1]));
		const toP = pToV2D(getStart(elements[0]));
		if (fromP.equals(toP))
			return; // no need for this line hint.
		const line = new LineHint(fromP, toP);
		return line;
	}
	const inputShapes = drawing.getShapesArray();
	const result = [];
	for (let i = 0; i < inputShapes.length; i++) {
		const shape = inputShapes[i];
		if (shape instanceof LineSegmentShape) {
			result.push(new LineHint(pToV2D(shape.position), pToV2D(shape.endPoint)));
		}
		else if (shape instanceof PathShape) {
			const elements = shape.elements;
			for (let i = 1; i < elements.length; i++) {
				const element = pToV2D(elements[i]);
				const previous = pToV2D(elements[i - 1]);
				if (previous !== element) {
					result.push(new LineHint(previous, element));
				}
			}
			const lastLine = getLineHintFromClosedPath(shape);
			if (lastLine !== undefined)
				result.push(lastLine);
		}
	}
	return result;
};