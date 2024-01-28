import { compareByFirstValue } from './compareByFirstValue.js';

export function gradientStopPointMapToArray(colorStopsMap) {
	const result = [];
	for (const [key, value] of colorStopsMap) {
		result.push([key, value]);
	}
	result.sort(compareByFirstValue);
	return result;
};