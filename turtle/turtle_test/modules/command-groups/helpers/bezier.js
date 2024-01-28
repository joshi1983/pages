import { nChooseK } from './nChooseK.js';

/*
Implements math formulas described at:
https://javascript.info/bezier-curve
*/
export function bezier(points, t) {
	const t2 = 1 - t;
	const result = [];
	const numPoints = points.length;
	const numDimensions = points[0].length;
	result.length = numDimensions;
	for ( let j = 0; j < numDimensions; j++) {
		result[j] = 0;
	}
	const n = numPoints - 1;
	for (let i = 0; i < numPoints; i++) {
		const t2Exponent = n - i;
		const tExponent = i;
		const constantCoefficient = nChooseK(n, i);
		const t2Factor = Math.pow(t2, t2Exponent);
		const tFactor = Math.pow(t, tExponent);
		const factor = constantCoefficient * t2Factor * tFactor;
		for ( let j = 0; j < numDimensions; j++) {
			result[j] += factor * points[i][j];
		}
	}

	return result;
};