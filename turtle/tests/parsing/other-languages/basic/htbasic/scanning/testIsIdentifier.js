import { isIdentifier } from
'../../../../../../modules/parsing/other-languages/basic/htbasic/scanning/isIdentifier.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testIsIdentifier(logger) {
	const cases = [
		/*
		Cases from Variables and Data Types section at
		https://www.techsoft.de/sw/load/HTB/2021/HTBasic-Help.pdf
		*/
		{'in': 'This_is_just_too_long',
			'out': false
			// too long.
		},
		{'in': 'FOR', 'out': false},
		{'in': 'For', 'out': true},
		{'in': 'Smile_1', 'out': true},
	];
	testInOutPairs(cases, isIdentifier, logger);
};