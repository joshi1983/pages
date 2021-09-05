import { equalWithinThreshold } from '../modules/equalWithinThreshold.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';

export function testEqualWithinThreshold(logger) {
	const cases = [
	{'inArgs': [1, 2, 0.1], 'out': false},
	{'inArgs': [2, 1, 0.1], 'out': false},
	{'inArgs': [1, 2, 2], 'out': true},
	{'inArgs': [2, 1, 2], 'out': true},
	{'inArgs': [-2, -1, 2], 'out': true},
	{'inArgs': [-1, -2, 2], 'out': true},
	{'inArgs': [-1, -2, 0.1], 'out': false},
	];
	testInOutPairs(cases, equalWithinThreshold, logger);
};