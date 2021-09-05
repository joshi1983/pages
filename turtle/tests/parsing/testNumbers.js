import { findLongestMatch, isNumeric, signedNumberRegEx } from '../../modules/parsing/Numbers.js';

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
	{'in': '+1', 'out': true},
	{'in': '-1', 'out': true},
	{'in': '+12', 'out': true},
	{'in': '+.1', 'out': true},
	{'in': '+0.1', 'out': true},
	{'in': '.1', 'out': true},
	{'in': '3.1415', 'out': true},
	];
	cases.forEach(function(caseInfo) {
		const result = isNumeric(caseInfo.in);
		if (result !== caseInfo.out)
			logger('isNumeric("' + caseInfo.in + '") expected to return ' + caseInfo.out + ' but got ' + result);
	});
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
	cases.forEach(function(caseInfo) {
		const result = findLongestMatch(caseInfo.in);
		if (result !== caseInfo.out)
			logger('findLongestMatch("' + caseInfo.in + '") expected to return ' + caseInfo.out + ' but got ' + result);
	});
}

export function testNumbers(logger) {
	testFindLongestMatch(logger);
	testIsNumeric(logger);
};