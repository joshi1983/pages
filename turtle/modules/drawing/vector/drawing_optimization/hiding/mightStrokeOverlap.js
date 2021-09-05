import { areAllColourStopsOpaque } from './areAllColourStopsOpaque.js';

// checks if shape1's strokes might overlap shape2's strokes/lines
export function mightStrokeOverlap(shape1, shape2) {
	if (typeof shape1 !== 'object')
		throw new Error(`shape1 must be an object and more specifically a Shape but found ${shape1}`);
	if (typeof shape1.style !== 'object')
		throw new Error(`shape1.style must be an object but found ${shape1.style}`);
	if (typeof shape2 !== 'object')
		throw new Error(`shape2 must be an object and more specifically a Shape but found ${shape2}`);

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