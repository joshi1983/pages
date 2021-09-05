import { sanitizePythonCode } from
'../../../../../modules/parsing/python-parsing/parsing/code-sanitizers/sanitizePythonCode.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testSanitizePythonCode(logger) {
	const cases = [
		{'in': 'print(3)', 'changed': false},
		{'in': 'print(3)\nprint(5)', 'changed': false},
		{'in': '... print(3)', 'out': 'print(3)'},
		{'in': '>>> print(3)', 'out': 'print(3)'}
	];
	testInOutPairs(cases, sanitizePythonCode, logger);
};