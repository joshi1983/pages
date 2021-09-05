import { processFixerTestCases } from
'../../../js-parsing/translation-to-weblogo/simplifying/processFixerTestCases.js';
import { removeUnneededCurvedBrackets } from
'../../../../../modules/parsing/compiling/to-js/js-simplifiers/removeUnneededCurvedBrackets.js';

export function testRemoveUnneededCurvedBrackets(logger) {
	const cases = [
		{'code': '2', 'changed': false},
		{'code': '"hi"', 'changed': false},
		{'code': 'console.log(between?(1,2,3))', 'changed': false},
		{'code': 'console.log(3)', 'changed': false},
		{'code': 'console.log((3))', 'to': 'console.log(3)'},
		{'code': 'console.log((x))', 'to': 'console.log(x)'},
		{'code': 'console.log((f()))', 'to': 'console.log(f())'},
		{'code': 'console.log((3)+(19))', 'to': 'console.log(3+19)'},
		{'code': 'console.log(1 + (2*3))', 'to': 'console.log(1 + 2*3)'},
	];
	processFixerTestCases(cases, removeUnneededCurvedBrackets, logger);
};
