import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecType(logger) {
	const cases = [
		{'code': `type "hi"`, 'messages': ['hi']},
		{'code': `type 1+2`, 'messages': ['3']},
		{'code': `type -1-2`, 'messages': ['-3']},
		{'code': `type 1-2`, 'messages': ['-1']},
		{'code': `type 1--2`, 'messages': ['3']}, // same as 1 - -2 or 1 + 2
		{'code': `type 1/2`, 'messages': ['0.5']},
		{'code': `type 10/2`, 'messages': ['5']},
		{'code': 'type 2•3', 'messages': ['6']},
		{'code': 'type 2•4', 'messages': ['8']},
		{'code': 'type -3•3', 'messages': ['-9']},

		{'code': `type 1*2`, 'messages': ['1']},
		{'code': `type 2*2`, 'messages': ['4']},
		{'code': `type 3*2`, 'messages': ['9']},
			// Note * is for exponentiation in JOSS.
			// That can be confusing because almost every other programming language treats 
			// * as a multiplication operator.

	];
	processTranslateExecuteCases(cases, logger);
};