import { matrixMultiplyInPlace3By3 } from '../../../modules/drawing/vector/matrixMultiplyInPlace3By3.js';

export function testMatrixMultiplyInPlace3By3(logger) {
// case copied from an example at:
// https://www.geeksforgeeks.org/matrix-multiplication
// I'm pretty sure the [0][2] and [1][2] values are wrong on that page, though.
// I replaced with the values 0 and 39 which should be correct.
	const a = [
	[3, -5, 1],
	[-2, 0, 4],
	[-1, 6, 5]
	];
	const b = [
	[7, 2, 4],
	[0, 1, -5],
	[1, 3, 2]
	];
	matrixMultiplyInPlace3By3(a, b);
	const expected = [
	[22, 4, 39],
	[-10, 8, 0],
	[-2, 19, -24]
	];
	if (a.length !== 3)
		logger(`Expected a.length to be 3 but found ${a.length}`);
	for (let i = 0; i < 3; i++) {
		if (!(a[i] instanceof Array))
			logger(`Expected a[${i}] to be an Array but got ${a[i]}`);
		else if (a[i].length !== 3)
			logger(`Expected a[${i}].length to be 3 but found ${a.length}`);
		else {
			for (let j = 0; j < 3; j++) {
				if (expected[i][j] !== a[i][j])
					logger(`Expected a[${i}][${j}] to be ${expected[i][j]} but found ${a[i][j]}`);
			}
		}
	}
};