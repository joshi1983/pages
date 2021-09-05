import { StringUtils } from '../modules/StringUtils.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';

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

function testContainsAny(logger) {
	const cases = [
		{'inArgs': ['', []], 'out': false},
		{'inArgs': ['', ['h']], 'out': false},
		{'inArgs': ['hello', ['h']], 'out': true},
		{'inArgs': ['hello', ['b']], 'out': false},
		{'inArgs': ['hello', ['h', 'o']], 'out': true},
		{'inArgs': ['hello', ['b', 'o']], 'out': true},
	];
	testInOutPairs(cases, StringUtils.containsAny, logger);
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

function testEscapeHTML(logger) {
	const cases = [
		{'in': 'hello', 'out': 'hello'},
		{'in': '1 < 3', 'out': '1 &lt; 3'},
		{'in': '1 <<< 3', 'out': '1 &lt;&lt;&lt; 3'},
		{'in': '1 <b> 3', 'out': '1 &lt;b&gt; 3'},
		{'in': '<br>', 'out': '&lt;br&gt;'},
	];
	testInOutPairs(cases, StringUtils.escapeHTML, logger);
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

function testReplacePairs(logger) {
	const cases = [
		{'inArgs': ['', []], 'out': ''},
		{'inArgs': ['hello', []], 'out': 'hello'},
		{'inArgs': ['hello', [['h', 'H']]], 'out': 'Hello'},
		{'inArgs': ['hello', [['h', '']]], 'out': 'ello'},
		{'inArgs': ['hello', [['H', '']]], 'out': 'hello'},
		{'inArgs': ['hello', [['h', 'H'], ['H', 'm']]], 'out': 'Hello'},
		{'inArgs': ['hello', [['h', 'H'], ['e', 'E']]], 'out': 'HEllo'},
		{'inArgs': ['hello', [['e', 'E']]], 'out': 'hEllo'},
		{'inArgs': ['hello', [['o', 'O World']]], 'out': 'hellO World'},
	];
	testInOutPairs(cases, StringUtils.replacePairs, logger);
}

export function testStringUtils(logger) {
	wrapAndCall([
		testCapitalizeFirstLetter,
		testContainsAny,
		testCountChar,
		testEscapeHTML,
		testFirstCharLower,
		testForceFileExtension,
		testGetLengthOfEqualEnding,
		testIndexOfNthOccurrance,
		testReplacePairs
	], logger);
};