import { isStartOfNumber } from '../../../modules/parsing/scanning/isStartOfNumber.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testIsStartOfNumber(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'e', 'out': false},
	{'in': 'e+', 'out': false},
	{'in': 'e-', 'out': false},
	{'in': 'E', 'out': false},
	{'in': 'E+', 'out': false},
	{'in': 'E-', 'out': false},
	{'in': '+', 'out': false},
	{'in': '-', 'out': false},
	{'in': '12.3.', 'out': false},
	{'in': '+.', 'out': true},
	{'in': '-.', 'out': true},
	{'in': '.', 'out': true},
	{'in': '+2', 'out': true},
	{'in': '-2', 'out': true},
	{'in': '12', 'out': true},
	{'in': '-12', 'out': true},
	{'in': '+12', 'out': true},
	{'in': '12.', 'out': true},
	{'in': '12.3', 'out': true},
	{'in': '-12.3', 'out': true},
	{'in': '+12.3', 'out': true},
	{'in': '12e', 'out': true},
	{'in': '12e3', 'out': true},
	{'in': '12E3', 'out': true},
	{'in': '-12E34', 'out': true},
	{'in': '-12E-34', 'out': true}
	];
	testInOutPairs(cases, isStartOfNumber, logger);
};