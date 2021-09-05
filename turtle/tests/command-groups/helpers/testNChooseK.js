import { nChooseK } from '../../../modules/command-groups/helpers/nChooseK.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testNChooseK(logger) {
	/*
	A couple test cases are from:
	https://www.cuemath.com/n-choose-k-formula/
	*/
	const cases = [
		{'inArgs': [2, 1], 'out': 2},
		{'inArgs': [3, 2], 'out': 3},

		{'inArgs': [4, 4], 'out': 1},
		/*
		The wikipedia article says the result should be 1 any time k = n.
		*/

		{'inArgs': [4, 5], 'out': 0},
		/*
		The wikipedia article mentions that the result should be 0 if k > n.
		*/
		{'inArgs': [5, 4], 'out': 5},
		// from https://www.mathworks.com/help/matlab/ref/nchoosek.html

		{'inArgs': [10, 5], 'out': 252},
		{'inArgs': [10, 6], 'out': 210},
		{'inArgs': [50, 2], 'out': 1225},
	];
	testInOutPairs(cases, nChooseK, logger);
};