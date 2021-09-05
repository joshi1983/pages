/*
These are methods listed at:
in SVG at:
https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
and in canvas 2D context at:
https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap
*/
import { LineCap } from '../../../drawing/vector/shapes/style/LineCap.js';
const lineCaps = LineCap.getNames();

export function lineCap(s) {
	s = s.trim().toLowerCase();
	if (lineCaps.indexOf(s) === -1)
		return `Unsupported line cap "${s}".  The line cap must be one of ${lineCaps.join(',')}`;
};