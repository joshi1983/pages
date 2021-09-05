import { processTestCases } from
'../../processTestCases.js';
import { simplifyWithLiterals } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyWithLiterals.js';

export function testSimplifyWithLiterals(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': '1', 'logged': false},
		{'code': '-3', 'logged': false},
		{'code': '1+2', 'to': '3', 'logged': true},
		{'code': '1-2', 'to': '-1', 'logged': true},
		{'code': '2*3', 'to': '6', 'logged': true},
		{'code': '10/2', 'to': '5', 'logged': true},
		{'code': ':x + 10/2', 'to': ':x + 5', 'logged': true},
		{'code': 'pi', 'to': '3.141592653589793', 'logged': true},
		{'code': 'goldenRatio', 'to': '1.618033988749895', 'logged': true},
		{'code': 'print product 2 1+3', 'to': 'print 8  ', 'logged': true}
	];
	processTestCases(cases, simplifyWithLiterals, logger);
};