import { thenFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/thenFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testThenFixer(logger) {
	const cases = [
		{'code': `;
TO SETUP_SCREEN
    (STAMPRECT)
END`, 'logged': false},
		{'code': 'print "|something I do then something big happened|', 'logged': false},
		// We want to prevent changes in some detectably problematic cases.

		{'code': 'if 1 then [print "hi]', 'to': 'if 1  [print "hi]', 'logged': true},
		{'code': 'if 1 then print "hi', 'to': 'if 1  [print "hi]', 'logged': true},
	];
	processTestCases(cases, thenFixer, logger);
};