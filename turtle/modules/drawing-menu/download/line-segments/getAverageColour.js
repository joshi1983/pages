import { styleToColour } from '../styleToColour.js';

export function getAverageColour(lineSegment) {
	return styleToColour(lineSegment.style);
};