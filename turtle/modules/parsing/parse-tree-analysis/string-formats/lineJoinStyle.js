/*
These are methods listed at:
in SVG at:
https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
and in canvas 2D context at:
https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
*/
import { LineJoinStyle } from '../../../drawing/vector/shapes/style/LineJoinStyle.js';
const lineJoinStyles = LineJoinStyle.getNames();

export function lineJoinStyle(s) {
	s = s.trim().toLowerCase();
	if (lineJoinStyles.indexOf(s) === -1)
		return `Unsupported line join style "${s}".  The line join style must be one of ${lineJoinStyles.join(',')}`;
};