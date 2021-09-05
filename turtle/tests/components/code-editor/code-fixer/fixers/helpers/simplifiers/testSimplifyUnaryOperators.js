import { processTestCases } from
'../../processTestCases.js';
import { simplifyUnaryOperators } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyUnaryOperators.js';

export function testSimplifyUnaryOperators(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print -:x', 'logged': false},
		{'code': 'print --:x', 'to': 'print :x', 'logged': true},
		{'code': 'print ---:x', 'to': 'print -:x', 'logged': true},
		{'code': '--', 'to': '', 'logged': true},
	];
	processTestCases(cases, simplifyUnaryOperators, logger);
};