import { findLongestMatch, isNumeric, signedNumberRegEx } from '../../modules/parsing/Numbers.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';

function testIsNumeric(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'A', 'out': false},
	{'in': 'a', 'out': false},
	{'in': 'a1', 'out': false},
	{'in': 'z1', 'out': false},
	{'in': '"1', 'out': false},
	{'in': ':1', 'out': false},
	{'in': '.', 'out': false},
	{'in': '1a', 'out': false},
	{'in': 'E1', 'out': false},
	{'in': 'e1', 'out': false},
	{'in': '1E', 'out': false},
	{'in': '1e', 'out': false},
	{'in': '1e-', 'out': false},
	{'in': '1E-', 'out': false},
	{'in': '+1', 'out': true},
	{'in': '-1', 'out': true},
	{'in': '+12', 'out': true},
	{'in': '+.1', 'out': true},
	{'in': '+0.1', 'out': true},
	{'in': '.1', 'out': true},
	{'in': '3.1415', 'out': true},
	{'in': '1E1', 'out': true},
	{'in': '1E2', 'out': true},
	{'in': '1E9', 'out': true},
	{'in': '1e1', 'out': true},
	{'in': '1E12', 'out': true},
	{'in': '1e12', 'out': true},
	{'in': '1E-1', 'out': true},
	{'in': '1E-12', 'out': true},
	{'in': '1e-1', 'out': true},
	{'in': '1e-12', 'out': true},
	{'in': '1E+1', 'out': true},
	{'in': '1E+12', 'out': true},
	{'in': '1.2E+1', 'out': true}
	];
	testInOutPairs(cases, isNumeric, logger);
}

function testFindLongestMatch(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'hello', 'out': ''},
	{'in': 'hello1', 'out': ''},
	{'in': '1hello', 'out': '1'},
	{'in': 'h123', 'out': ''},
	{'in': '123a', 'out': '123'},
	{'in': '.2a', 'out': '.2'},
	{'in': '+.2a', 'out': '+.2'},
	{'in': '-.2a', 'out': '-.2'},
	{'in': 'hello-3.12world', 'out': ''},
	{'in': '3.12hello', 'out': '3.12'},
	{'in': '-3.12hello', 'out': '-3.12'},
	{'in': '+23.45-2', 'out': '+23.45'}
	];
	testInOutPairs(cases, findLongestMatch, logger);
}

export function testNumbers(logger) {
	testFindLongestMatch(logger);
	testIsNumeric(logger);
};