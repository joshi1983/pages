import { isValidProcedureName, joinHyphenatedProcedureNames } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/super-logo/joinHyphenatedProcedureNames.js';
import { processScanTokensTestCases } from
'./processScanTokensTestCases.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testIsValidProcedureName(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '\n', 'out': false},
		{'in': ' ', 'out': false},
		{'in': '\t', 'out': false},
		{'in': '-', 'out': false},
		{'in': 'x', 'out': true},
		{'in': 'X', 'out': true},
		{'in': 'x-x', 'out': true},
		{'in': 'x123-x', 'out': true}
	];
	testInOutPairs(cases, isValidProcedureName, logger);
};

function testVariousCases(logger) {
	const cases = [
		{'code': 'print x-y', 'tokens': ['print', 'x', '-', 'y']},
		{'code': 'to p', 'tokens': ['to', 'p']},
		{'code': 'to p :x', 'tokens': ['to', 'p', ':x']},
		{'code': 'to P', 'tokens': ['to', 'P']},
		{'code': 'to _', 'tokens': ['to', '_']},
		{'code': 'to p -', 'tokens': ['to', 'p', '-']},
		{'code': 'to p-', 'tokens': ['to', 'p', '-']},
		{'code': 'to p-x', 'tokens': ['to', 'px']},
		{'code': 'to circl-e', 'tokens': ['to', 'circle1']},
			// avoid calling the procedure 'circle' since that would clash with a built-in command for WebLogo.
		
		{'code': 'to p-x-', 'tokens': ['to', 'px', '-']},
		{'code': 'to p-x-z', 'tokens': ['to', 'pxz']},
		{'code': 'to p123-xABC-z_2', 'tokens': ['to', 'p123xABCz_2']},
		{'code': 'to p123-xABC-z_2\np123-xABC-z_2\nend',
			'tokens': ['to', 'p123xABCz_2', '\n', 'p123xABCz_2', '\n', 'end']
		}
	];
	processScanTokensTestCases(cases, joinHyphenatedProcedureNames, logger);
}

export function testJoinHyphenatedProcedureNames(logger) {
	wrapAndCall([
		testIsValidProcedureName,
		testVariousCases
	], logger);
};