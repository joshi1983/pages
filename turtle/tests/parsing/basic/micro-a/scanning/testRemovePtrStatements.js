import { processScanTokensTestCases } from './processScanTokensTestCases.js';
import { removePtrStatements } from
'../../../../../modules/parsing/basic/micro-a/scanning/removePtrStatements.js';

/*
We remove the ptr statements because they seem to always be declaring variables used in
untranslatable sections of code like Windows message blocks.
*/
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