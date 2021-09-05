import { processSanitizeTestCases } from './processSanitizeTestCases.js';
import { splitMinusOperator } from
'../../../../../modules/parsing/python-parsing/scanning/token-sanitizers/splitMinusOperator.js';

export function testSplitMinusOperator(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'm = m - 1', 'tokens': ['m', '=', 'm', '-', '1']},
		{'code': 'm = m -1', 'tokens': ['m', '=', 'm', '-', '1']},
		{'code': 'm = m-1', 'tokens': ['m', '=', 'm', '-', '1']},
		{'code': 'm =m-1', 'tokens': ['m', '=', 'm', '-', '1']},
		{'code': 'm=m-1', 'tokens': ['m', '=', 'm', '-', '1']},
		{'code': 'm = m-n', 'tokens': ['m', '=', 'm', '-', 'n']},
		{'code': 'm -= 5', 'tokens': ['m', '-=', '5']},
		{'code': 'm-=5', 'tokens': ['m', '-=', '5']},
		{'code': '-n', 'tokens': ['-', 'n']},
		{'code': '-3', 'tokens': ['-3']},
		{'code': '[x:-1]', 'tokens': ['[', 'x', ':', '-1', ']']},
		{'code': ':-1]', 'tokens': [':', '-1', ']']},
		{'code': 'i*-1', 'tokens': ['i', '*', '-1']},
		{'code': 'i **-1', 'tokens': ['i', '**', '-1']},
		{'code': 'i and-1', 'tokens': ['i', 'and', '-1']}, 
			// weird operand -1 for a logical operator but we want it to work a specific way.
		{'code': 'i or-1', 'tokens': ['i', 'or', '-1']},
		{'code': 'i*-x', 'tokens': ['i', '*', '-', 'x']}
	];
	processSanitizeTestCases(cases, splitMinusOperator, logger);
};