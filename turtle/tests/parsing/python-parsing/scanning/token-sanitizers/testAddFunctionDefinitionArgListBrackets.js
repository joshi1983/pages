import { addFunctionDefinitionArgListBrackets } from
'../../../../../modules/parsing/python-parsing/scanning/token-sanitizers/addFunctionDefinitionArgListBrackets.js';
import { processSanitizeTestCases } from './processSanitizeTestCases.js';

export function testAddFunctionDefinitionArgListBrackets(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'def f():',
			'tokens': ['def', 'f', '(', ')', ':']},
		{'code': 'def f:',
			'tokens': ['def', 'f', '(', ')', ':']},
		{'code': 'def f',
			'tokens': ['def', 'f', '(', ')', ':']},
		{'code': 'def f\nprint "hi"',
			'tokens': ['def', 'f', '(', ')', ':', 'print', '"hi"']},
	];
	processSanitizeTestCases(cases, addFunctionDefinitionArgListBrackets, logger);
};