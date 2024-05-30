import { getTransposeOfMatrix } from
'../../../modules/drawing/vector/getTransposeOfMatrix.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testGetTransposeOfMatrix(logger) {
	const cases = [
	{'in': [
		[1, 0],
		[0, 1]
	],
	'out': [
		[1, 0],
		[0, 1]
	]
	},
	{'in': [
	[1, 2, 3],
	[4, 5, 6]
	], 'out': [
	[1, 4],
	[2, 5],
	[3, 6]
	]},
	// examples copied from 
	// https://byjus.com/maths/transpose-of-a-matrix/
	{'in': [
		[7, 11],
		[21, 16]
	], 'out': [
		[7, 21],
		[11, 16]
	]},
	{'in': [
	[2, -9, 3],
	[13, 11, -17],
	[3, 6, 15],
	[4, 13, 1]
	], 'out': [
	[2, 13, 3, 4],
	[-9, 11, 6, 13],
	[3, -17, 15, 1]
	]}
	];
	testInOutPairs(cases, getTransposeOfMatrix, logger);
};