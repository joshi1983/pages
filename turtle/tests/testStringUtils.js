import { prefixWrapper } from './helpers/prefixWrapper.js';
import { StringUtils } from '../modules/StringUtils.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';

function testCapitalizeFirstLetter(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'h', 'out': 'H'},
		{'in': 'a', 'out': 'A'},
		{'in': 'abc', 'out': 'Abc'},
		{'in': 'HELLO', 'out': 'HELLO'},
		{'in': 'hi', 'out': 'Hi'},
	];
	testInOutPairs(cases, StringUtils.capitalizeFirstLetter, logger);
}

function testCountChar(logger) {
	const cases = [
		{'inArgs': ['', 'l'], 'out': 0},
		{'inArgs': ['hello', 'l'], 'out': 2},
		{'inArgs': ['hello', 'l', 0, 5], 'out': 2},
		{'inArgs': ['hello world', 'l', 0, 5], 'out': 2},
		{'inArgs': ['hello world', 'l', 0], 'out': 3},
		{'inArgs': ['hi', 'i', 0, 1], 'out': 0},
		{'inArgs': ['hi', 'i', 0, 2], 'out': 1},
	];
	testInOutPairs(cases, StringUtils.countChar, logger);
}

function testFirstCharLower(logger) {
	const cases = [
		{'in': 'HELLO', 'out': 'hELLO'},
		{'in': 'hi', 'out': 'hi'},
	];
	testInOutPairs(cases, StringUtils.firstCharLower, logger);
}

function testForceFileExtension(logger) {
	const cases = [
		{'inArgs': ['', 'jpg'], 'out': '.jpg'},
		{'inArgs': ['hi', 'jpg'], 'out': 'hi.jpg'},
		{'inArgs': ['hi.txt', 'jpg'], 'out': 'hi.jpg'}
	];
	testInOutPairs(cases, StringUtils.forceFileExtension, logger);
}

function testGetLengthOfEqualEnding(logger) {
	const cases = [
		{'inArgs': ['', 'hello'], 'out': 0},
		{'inArgs': ['hello', 'o'], 'out': 1},
		{'inArgs': ['hello', 'lo'], 'out': 2},
		{'inArgs': ['hello', 'hello'], 'out': 5},
		{'inArgs': ['fd 4', 'fd 45'], 'out': 0},
		{'inArgs': [';', ';5'], 'out': 0},
		{'inArgs': [';', ';;'], 'out': 1},
		{'inArgs': [';', ';;', 1], 'out': 0},
	];
	// add cases for the arguments swapped.
	for (let i = cases.length - 1; i >= 0; i--) {
		const caseInfo = cases[i];
		if (caseInfo.inArgs[0] !== caseInfo.inArgs[1] && caseInfo.inArgs.length === 2) {
			cases.push({
				'inArgs': [caseInfo.inArgs[1], caseInfo.inArgs[0]],
				'out': caseInfo.out
			});
		}
	}
	testInOutPairs(cases, StringUtils.getLengthOfEqualEnding, logger);
}

function testIndexOfNthOccurrance(logger) {
	const cases = [
		{'inArgs': ['', 0, 'l', 0], 'out': -1},
		{'inArgs': ['hi', 0, 'i', 0], 'out': 1},
		{'inArgs': ['hello', 0, 'l', 0], 'out': 2},
		{'inArgs': ['hello', 0, 'l', 1], 'out': 3},
		{'inArgs': ['hello', 0, 'l', 2], 'out': -1},
		{'inArgs': ['hello world', 0, 'w', 0], 'out': 6},
	];
	testInOutPairs(cases, StringUtils.indexOfNthOccurrance, logger);
}

export function testStringUtils(logger) {
	testCapitalizeFirstLetter(prefixWrapper('testCapitalizeFirstLetter', logger));
	testCountChar(prefixWrapper('testCountChar', logger));
	testFirstCharLower(prefixWrapper('testFirstCharLower', logger));
	testForceFileExtension(prefixWrapper('testForceFileExtension', logger));
	testGetLengthOfEqualEnding(prefixWrapper('testGetLengthOfEqualEnding', logger));
	testIndexOfNthOccurrance(prefixWrapper('testIndexOfNthOccurrance', logger));
};