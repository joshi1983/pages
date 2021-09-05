import { foregroundColoursToBackgroundColour } from '../foregroundColoursToBackgroundColour.js';

export function pointsToBackgroundColour(points) {
	return foregroundColoursToBackgroundColour(points.map(point => point.colour));
};