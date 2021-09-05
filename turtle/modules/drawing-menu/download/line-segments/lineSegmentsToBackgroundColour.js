import { foregroundColoursToBackgroundColour } from '../foregroundColoursToBackgroundColour.js';
import { getAverageColour } from './getAverageColour.js';

export function lineSegmentsToBackgroundColour(lines) {
	return foregroundColoursToBackgroundColour(lines.map(line => line.colour));
};