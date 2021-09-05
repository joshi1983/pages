import { removePtrStatements } from
'../../../../../modules/parsing/basic/micro-a/scanning/removePtrStatements.js';
import { processScanTokensTestCases } from './processScanTokensTestCases.js';

export function testRemovePtrStatements(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'ptr x', 'tokens': []},
		{'code': 'print "hi"\nptr x',
			'tokens': ['print', '"hi"']},
		{'code': 'print "hi"\nptr x,y,z',
			'tokens': ['print', '"hi"']},
		{'code': 'print "hi"\nptr x\nprint "yo"',
			'tokens': ['print', '"hi"', 'print', '"yo"']},
		{'code': 'print "hi"\nptr x,y,z\nprint "yo"',
			'tokens': ['print', '"hi"', 'print', '"yo"']},
	];
	processScanTokensTestCases(cases, removePtrStatements, logger);
};