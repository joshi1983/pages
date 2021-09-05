import { ifElseStatementFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/ifElseStatementFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testIfElseStatementFixer(logger) {
	const cases = [
	{'code': 'ifelse 4 > 3 [] []', 'logged': false},
	{'code': 'if 4 > 3 []', 'logged': false},
	{'code': 'if 4 > 3 [] else []', 'to': 'ifElse 4 > 3 []  []', 'logged': true},
	{'code': 'if 4 > 3 [print "hi] else [print "bye]', 'to': 'ifElse 4 > 3 [print "hi]  [print "bye]', 'logged': true},
	];
	processTestCases(cases, ifElseStatementFixer, logger);
};