/*
Checks if the difference between num1 and num2 is within the specified threshold.

threshold should be greater than 0.
A negative threshold implies a return value of false.
*/
export function equalWithinThreshold(num1, num2, threshold) {
	const diff = Math.abs(num1 - num2);
	return diff < threshold;
};