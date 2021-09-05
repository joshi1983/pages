import { distanceToLine } from './distanceToLine.js';

export function distanceToLines(turtle, lines) {
	let result = -1;
	for (const line of lines) {
		const distance = distanceToLine(turtle, line[0], line[1]);
		if (distance > 0 && (result < 0 || result > distance))
			result = distance;
	}
	return result;
};