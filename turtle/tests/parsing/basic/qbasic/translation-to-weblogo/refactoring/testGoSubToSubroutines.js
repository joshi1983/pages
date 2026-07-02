import { goSubToSubroutines } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/goSubToSubroutines.js';
import { processFixerCases } from './processFixerCases.js';

export function testGoSubToSubroutines(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': '123:', 'changed': false},
		{'code': 'gosub 123\n123:', 'changed': false},
		{'code': 'gosub 123\n12:return', 'changed': false},
		{'code': 'gosub 123\n123:return',
		'to': 'sub123()\nsub sub123() end sub'},
		{'code': 'gosub 123\ngosub 123\n123:return',
		'to': 'sub123()\nsub123()\nsub sub123() end sub'},
	];
	processFixerCases(cases, goSubToSubroutines, logger);

};