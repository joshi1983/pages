import { gotoToForeverFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/gotoToForeverFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testGotoToForeverFixer(logger) {
	const cases = [
		{'code': 'x: goto x',
			'to': 'x: forever[ ] ',
			'logged': true
		},
		{'code': 'x: print "hi goto x',
			'to': 'x: forever[ print "hi ] ',
			'logged': true
		},
	];
	processTestCases(cases, gotoToForeverFixer, logger);
};