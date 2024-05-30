import { getDeterminantFromMatrix } from '../../../modules/drawing/vector/getDeterminantFromMatrix.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

/*
A matrix calculator could be useful for testing other cases.

One such calculator is at:
https://www.symbolab.com/solver/matrix-determinant-calculator/
Click the 2x2 or whatever buttons above to select the size of matrix and then you can fill in the numbers.
*/
export function testGetDeterminantFromMatrix(logger) {
	const cases = [
	// The determinant of identity matrices is 1.
	{'in': [
	[1]
	], 'out': 1},
	{'in': [
	[1, 0],
	[0, 1]
	], 'out': 1},
	{'in': [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1]
	], 'out': 1},
	{'in': [
	[1, 0, 0, 0],
	[0, 1, 0, 0],
	[0, 0, 1, 0],
	[0, 0, 0, 1],
	], 'out': 1},
	{'in': [
	[1, 0, 0, 0, 0],
	[0, 1, 0, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 0, 0, 1, 0],
	[0, 0, 0, 0, 1],
	], 'out': 1},
	{'in': [
	[1, 0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 0],
	[0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 1],
	], 'out': 1},

	// some 1 by 1 matrix examples copied from:
	// https://www.algebrapracticeproblems.com/determinant-of-a-1x1-matrix/
	{'in': [[3]], 'out': 3},
	{'in': [[5]], 'out': 5},
	{'in': [[-2]], 'out': -2},

	// some 2 by 2 matrix examples were copied from:
	// https://www.chilimath.com/lessons/advanced-algebra/determinant-2x2-matrix/
	{
		'in': [
		[1,2],
		[3,4],
		],
		'out': -2
	},
	{
		'in': [
		[-5,-4],
		[-2,-3],
		],
		'out': 7
	},
	{
		'in': [
		[-1,-2],
		[6,3],
		],
		'out': 9
	},
	{
		'in': [
		[-4,2],
		[-8,7],
		],
		'out': -12
	},
	/*
	Some of these test cases were copied from:
	https://byjus.com/maths/determinant-of-a-3x3-matrix/
	*/
	{
		'in': [
		[0,1,1],
		[1,1,0],
		[1,0,1]],
		'out': -2
	},
	// the following example was copied from
	// https://en.wikipedia.org/wiki/Determinant
	{'in': [
		[-2, -1, 2],
		[2, 1, 4],
		[-3, 3, -1]
	], 'out': 54},
	
	// Some 4 by 4 examples are at:
	// https://byjus.com/maths/determinant-of-4x4-matrix/
	{'in': [
	[1, 2, 6, 6],
	[4, 7, 3, 2],
	[0, 0, 0, 0],
	[1, 2, 2, 9]
	], 'out': 0},
	{'in': [
	[2, 1, 2, 3],
	[6, 7, 6, 9],
	[0, 6, 0, 0],
	[1, 2, 1, 4]
	], 'out': 0},
	{'in': [
	[4, 3, 2, 2],
	[0, 1, -3, 3],
	[0, -1, 3, 3],
	[0, 3, 1, 1]
	], 'out': -240},

	// A 5 by 5 matrix example is at:
	// https://math.stackexchange.com/questions/1955784/how-to-find-the-determinant-of-a-5x5-matrix
	{'in': [
	[0, 6, -2, -1, 5],
	[0, 0, 0, -9, -7],
	[0, 15, 35, 0, 0],
	[0, -1, -11, -2, 1],
	[-2, -2, 3, 0, -2]
	],'out': 2480
	}
	];
	testInOutPairs(cases, getDeterminantFromMatrix, logger);
};