import { foregroundColoursToBackgroundColour } from '../foregroundColoursToBackgroundColour.js';

export function lineSegmentsToBackgroundColour(lines) {
	return foregroundColoursToBackgroundColour(lines.map(line => line.colour));
};