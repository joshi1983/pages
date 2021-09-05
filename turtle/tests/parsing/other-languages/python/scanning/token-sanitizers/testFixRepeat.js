import { fixRepeat } from
'../../../../../../modules/parsing/other-languages/python/scanning/token-sanitizers/fixRepeat.js';
import { processSanitizeTestCases } from './processSanitizeTestCases.js';

export function testFixRepeat(logger) {
	const cases = [
		{'code': 'repeat 12[',
			'tokens': ['repeat', '12', '[']
			// fixer shouldn't do anything because it doesn't match the expected pattern.
		},
		{'code': 'print repeat 12:',
			'tokens': ['print', 'repeat', '12', ':']
			// the print on the same line indicates the repeat doesn't fit the expected pattern.
		},
		{'code': 'repeat 12:',
			'tokens': ['for', '_1', 'in', 'range', '(', '12', ')', ':']},
		{'code': 'repeat 23:',
			'tokens': ['for', '_1', 'in', 'range', '(', '23', ')', ':']},
		{'code': `print("hi")
repeat 12:`,
			'tokens': [
				'print', '(', '"hi"', ')',
				'for', '_1', 'in', 'range', '(', '12', ')', ':'
			]},
	];
	processSanitizeTestCases(cases, fixRepeat, logger);
};