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

		{'code': `type |3|`, 'messages': ['3']},
		{'code': `type |-3|`, 'messages': ['3']},
		{'code': `type |-2|`, 'messages': ['2']},
		{'code': 'Type 1 in form 3.', 'messages': ['1']},
			// Ignore the form(format) since format 3 is not specified.

		{'code': 'type 1>1', 'messages': ['false']},
		{'code': 'type 1>2', 'messages': ['false']},
		{'code': 'type 1>0', 'messages': ['true']},
		{'code': 'type 1<1', 'messages': ['false']},
		{'code': 'type 1<2', 'messages': ['true']},
		{'code': 'type 1<0', 'messages': ['false']},
		{'code': 'type 1=1', 'messages': ['true']},
		{'code': 'type 1=2', 'messages': ['false']},
		{'code': 'type 1≠1', 'messages': ['false']},
		{'code': 'type 1≠2', 'messages': ['true']},
			// I didn't see any transcript or documentation saying JOSS prints 
			// exactly true and false but they seem good for now.

		{'code': 'Type 1,2,3,4', 'messages': ['1, 2, 3, 4']},
		{'code': 'Type x for x=1(2)5.', 'messages': ['1', '3', '5']},
		{'code': 'Type x for x=1(1)3.', 'messages': ['1', '2', '3']},
		{'code': `1.1 Set x=x+1.
1.2 Type x.

Set x=0.
Do page 1 while x<3.`, 'messages': ['1', '2', '3'], 'analyzeCodeQuality': false},
// analyzeCodeQuality is false to prevent reporting of an incorrect warning about
// the while-loop condition always being true.
		{'code': `1.1 Set x=x*2.
1.2 Type x.

Set x=2.
Do page 1 while x<16.`, 'messages': ['4', '16'], 'analyzeCodeQuality': false}
	];
	processTranslateExecuteCases(cases, logger);
};