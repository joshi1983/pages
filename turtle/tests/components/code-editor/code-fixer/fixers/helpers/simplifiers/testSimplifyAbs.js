import { processTestCases } from
'../../processTestCases.js';
import { simplifyAbs } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyAbs.js';

export function testSimplifyAbs(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print abs 2', 'logged': false},
		{'code': 'print abs -2', 'logged': false},
		{'code': 'print abs :x', 'logged': false},
		{'code': 'print abs -:x', 'to': 'print abs :x', 'logged': true},
	];
	processTestCases(cases, simplifyAbs, logger);
};