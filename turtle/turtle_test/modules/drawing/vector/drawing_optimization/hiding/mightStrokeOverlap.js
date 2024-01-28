import { areAllColourStopsOpaque } from './areAllColourStopsOpaque.js';

export function mightStrokeOverlap(shape1, shape2) {
	const style = shape1.style;
	if (!style.isPenVisible())
		return false;
	const gradient = style.getPenGradient();
	if (gradient !== undefined) {
		if (!areAllColourStopsOpaque(gradient))
			return false;
			// if we're not sure that the lines are opaque, we can't conclude that path hides line.
	}
	if (style.getPenWidth() < shape2.style.getPenWidth())
		return false; // thinner lines can't hide thicker lines.
	return true;
};