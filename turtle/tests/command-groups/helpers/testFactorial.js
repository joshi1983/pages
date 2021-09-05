import { factorial } from '../../../modules/command-groups/helpers/factorial.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testFactorial(logger) {
	const cases = [
		{'in': 0, 'out': 1},
		{'in': 1, 'out': 1},
		{'in': 2, 'out': 2},
		{'in': 3, 'out': 6},
		{'in': 4, 'out': 24},
		{'in': 5, 'out': 120},
		{'in': 6, 'out': 720},
		{'in': 10, 'out': 3628800},
		{'in': 15, 'out': 1307674368000},
		{'in': 171, 'out': Infinity},
		{'in': 1000, 'out': 4.0238726E+2567}
	];
	testInOutPairs(cases, factorial, logger);

	/*
	Test factorial(170) in a special way because
	floating point error would interfere with the case
	if it was written in the cases Array.
	*/
	const result1 = factorial(170);
	const resultS = '' + result1;
	if (!resultS.startsWith('7.257415615'))
		logger(`Expected a result of 7.257415615E+306 for factorial(170) but got ${resultS}`);
};