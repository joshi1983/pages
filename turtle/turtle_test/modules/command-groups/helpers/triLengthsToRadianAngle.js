/*
 Uses Law of Cosines to compute the cosine ratio of one vertex in a triangle
 with lengths a, b, and c
 More can be learned about the Law of Cosines at:
 https://en.wikipedia.org/wiki/Law_of_cosines
*/
export function triLengthsToRadianAngle(a, b, c) {
	if (a === 0 || b === 0)
		return 0; // avoid division by zero.
	const ratio = (a * a + b * b - c * c) / (2 * a * b);
	if (Math.abs(ratio) <= 1)
		return Math.acos(ratio);
	else
		throw new Error(`Unable to find angle for a triangle that can't exist. a=${a}, b=${b}, c=${c}.`);
};