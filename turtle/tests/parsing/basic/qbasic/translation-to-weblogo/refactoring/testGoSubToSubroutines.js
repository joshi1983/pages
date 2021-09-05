import { goSubToSubroutines } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/goSubToSubroutines.js';
import { processFixerCases } from './processFixerCases.js';

export function testGoSubToSubroutines(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': '123:', 'changed': false},
		{'code': 'gosub 123\n123:', 'changed': false},
		{'code': 'gosub 123\n12:return', 'changed': false},
		{'code': 'gosub 123\nsub p()\n123:return\nend sub',
		'changed': false},
			// we don't want to add a new subroutine nested in an existing subroutine.
		{'code': 'gosub 456\ngosub 123\n456:\n123:\nreturn', 'changed': false},
			// another fixer should merge 456 and 123 labels together first.
			// goSubToSubroutines shouldn't do anything because the case is too complicated.
			// Another fixer should fix the multiple equivalent labels for 
			// the practically the same line.
			// mergeNeighbouringLabels and removeUnreferencedLabels are some fixers that should mutate the tree into something
			// more suitable for goSubToSubroutines.

		{'code': 'gosub 123\n123:return',
		'to': 'sub123()\nsub sub123() end sub'},
		{'code': 'gosub 123\ngosub 123\n123:return',
		'to': 'sub123()\nsub123()\nsub sub123() end sub'},
	];
	processFixerCases(cases, goSubToSubroutines, logger);

};