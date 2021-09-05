import { mixNumbers } from './mixNumbers.js';

/*
Assumptions:
val1.length === val2.length
Both arrays must contain nothing but numbers.
*/
export function mixNumberArrays(val1, val2, ratio) {
	const result = [];
	for (let i = 0; i < val1.length; i++) {
		result.push(mixNumbers(val1[i], val2[i], ratio));
	}
	return result;
};