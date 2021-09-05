import { processSanitizeTestCases } from './processSanitizeTestCases.js';
import { simplifyFunctionRenames } from
'../../../../../modules/parsing/python-parsing/scanning/token-sanitizers/simplifyFunctionRenames.js';

export function testSimplifyFunctionRenames(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': '=', 'tokens': ['=']},
		{'code': '=3', 'tokens': ['=', '3']},
		{'code': 'x=3', 'tokens': ['x','=', '3']},
		{'code': 'x=y', 'tokens': ['x','=', 'y']},
		{'code': 'forward(100)',
		'tokens': ['forward', '(', '100', ')']},
		{'code': 'turtle.forward(100)',
		'tokens': ['turtle', '.', 'forward', '(', '100', ')']},
		{'code': 'x=forward # some comment\nx(100)',
			'tokens': ['# some comment', 'forward', '(', '100', ')']},
		{'code': 'x = forward\nx(100)',
		'tokens': ['forward', '(', '100', ')']}
	];
	processSanitizeTestCases(cases, simplifyFunctionRenames, logger);
};