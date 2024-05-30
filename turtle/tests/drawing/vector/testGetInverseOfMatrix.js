import { getInverseOfMatrix } from
'../../../modules/drawing/vector/getInverseOfMatrix.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testGetInverseOfMatrix(logger) {
	const cases = [
	// The identity matrix is its own inverse.
	/*{'in': [
	[1, 0],
	[0, 1]
	], 'out': [
	[1, 0],
	[0, 1]
	]},
	{'in': [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1]
	], 'out': [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1]
	]},
	{'in': [
	[1, 0, 0, 0],
	[0, 1, 0, 0],
	[0, 0, 1, 0],
	[0, 0, 0, 1]
	], 'out': [
	[1, 0, 0, 0],
	[0, 1, 0, 0],
	[0, 0, 1, 0],
	[0, 0, 0, 1]
	]},*/
	// An example from https://www.mathsisfun.com/algebra/matrix-inverse.html
	{'in': [
	[3, 3.5],
	[3.2, 3.6]
	], 'out': [
	[-9, 8.75],
	[8, -7.5]
	], 'equalTolerance': 0.00001}
	];
	testInOutPairs(cases, getInverseOfMatrix, logger);
};