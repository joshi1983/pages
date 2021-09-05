import { forFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/forFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testForFixer(logger) {
	const cases = [
		{'code': `;
TO SETUP_SCREEN
    (STAMPRECT)
END`, 'logged': false},
		{'code': 'for', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'for "x', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'for ["i 0 10] []', 'logged': false},
		{'code': 'for "i 0 10 []', 'to': 'for ["i 0 10 ][]', 'logged': true},
		{'code': 'for "i 0 10 [ print "hi]', 'to': 'for ["i 0 10 ][ print "hi]', 'logged': true},
		{'code': 'FOR (LIST "I 1 4) [PRINT :I]', 'to': 'FOR [ "I 1 4] [PRINT :I]', 'logged': true},
		// This case is similar to an example at:
		// https://resources.terrapinlogo.com/weblogo/commands/flow#for
	];
	processTestCases(cases, forFixer, logger);
};