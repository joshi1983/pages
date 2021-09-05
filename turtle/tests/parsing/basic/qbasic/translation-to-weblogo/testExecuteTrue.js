import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

/*
true is not a keyword in QBASIC.
We want to support it in modules/parsing/basic/qbasic without losing full compatibility with
how QBASIC doesn't.

The following tests check that we can still treat true as a variable name.
*/
export function testExecuteTrue(logger) {
	const cases = [
		// The following cases were checked with QBASIC 1.1 emulated at 
		// https://archive.org/details/msdos_qbasic_megapack
		{'code': `let true = 1
print true`, 'messages': ['1']},
		{'code': `let false = 0
print false`, 'messages': ['0']},
		{'code': `dim false(1)
false(0) = 0
print false(0)`, 'messages': ['0']},
		{'code': `dim true(1)
true(0) = 0
print true(0)`, 'messages': ['0']},
		{'code': `x = true
print x`, 'messages': ['true']},
		{'code': `x = false
print x`, 'messages': ['false']},
	];
	processTranslateExecuteCases(cases, logger);
};