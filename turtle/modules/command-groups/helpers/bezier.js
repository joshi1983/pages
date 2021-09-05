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
	for (let i = 0; i < numDimensions; i++) {
		result[i] = 0;
	}
	for (let i = 0; i < points.length; i++) {
		for ( let j = 0; j < numDimensions; j++) {
			const t2Exponent = numPoints - i - 1;
			const tExponent = i;
			const constantCoefficient = ((i===0) || (i=== (numPoints-1))) ? 1 : (numPoints-1);
			let temp = constantCoefficient;
			temp *= Math.pow(t2, t2Exponent);
			temp *= Math.pow(t, tExponent);
			temp *= points[i][j];
			result[j] += temp;
		}
	}

	return result;
};