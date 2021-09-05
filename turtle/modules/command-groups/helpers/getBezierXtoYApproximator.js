import { bezier } from './bezier.js';
import { binarySearch } from '../../binarySearch.js';
import { clamp } from '../../clamp.js';
import { mixNumbers } from './mixNumbers.js';

function compareByX(p1, p2) {
	return p1[0] - p2[0];
}

function searchCompareByX(val1, val2) {
	if (typeof val1 !== 'number' && typeof val1 !== 'object')
		throw new Error('val1 must either be a number or an object.  Not: ' + val1);
	if (typeof val1 === 'number')
		return val1 - val2[0];
	else
		return val1[0] - val2;
}

export function getBezierXtoYApproximator(points, numPoints) {
	if (numPoints === undefined)
		numPoints = 100;
	const cachedPoints = [];
	for (let i = 0; i <= numPoints; i++) {
		const t = i / numPoints;
		const p = bezier(points, t);
		cachedPoints.push(p);
	}
	cachedPoints.sort(compareByX);
	return function(x) {
		let index = clamp(binarySearch(cachedPoints, searchCompareByX, x, true), 0, cachedPoints.length - 1);
		let nearestPoint = cachedPoints[index];
		let compareResult = searchCompareByX(nearestPoint, x);
		if (compareResult > 0) {
			if (index === 0)
				return nearestPoint[1];
			const prev = cachedPoints[index - 1];
			const denominator = nearestPoint[0] - prev[0];
			if (denominator === 0) // avoid division by 0.
				return nearestPoint[1];
			const ratio = (x - prev[0]) / denominator;
			return mixNumbers(nearestPoint[1], prev[1], ratio);
		}
		else if (compareResult === 0)
			return nearestPoint[1];
		else {
			if (index === cachedPoints.length - 1)
				return nearestPoint[1];
			const next = cachedPoints[index + 1];
			const denominator = next[0] - nearestPoint[0];
			if (denominator === 0) // avoid division by 0.
				return nearestPoint[1];
			const ratio = (next[0] - x) / denominator;
			return mixNumbers(nearestPoint[1], next[1], ratio);
		}
	};
};