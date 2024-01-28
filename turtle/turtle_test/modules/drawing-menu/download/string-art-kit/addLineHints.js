import { getLineHintsFromDrawing } from './getLineHintsFromDrawing.js';
import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { ShapeStyle } from '../../../drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

export function addLineHints(inputDrawing, distinctPoints, threshold, outputShapes) {
	const lineHints = getLineHintsFromDrawing(inputDrawing, distinctPoints, threshold);
	const style = new ShapeStyle();
	style.setPenWidth(threshold * 0.1);
	for (let i = 0; i < lineHints.length; i++) {
		const lineHint = lineHints[i];
		const from = new Vector3D(lineHint.p1);
		const to = new Vector3D(lineHint.p2);
		outputShapes.push(new LineSegmentShape(from, to, style));
	}
};