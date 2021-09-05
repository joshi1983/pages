import { removeSquareBracketsForNumberArguments } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/sanitization/removeSquareBracketsForNumberArguments.js';
import { processTestCases } from '../../processTestCases.js';

export function testRemoveSquareBracketsForNumberArguments(logger) {
	const cases = [
	{'code': 'print tan 4', 'logged': false},
	{'code': 'print tan [4', 'logged': false},
	{'code': 'print tan [4 x', 'logged': false},
	{'code': 'print tan [4]', 'to': 'print tan 4', 'logged': true},
	{'code': 'print tan [a]', 'to': 'print tan a', 'logged': true},
	{'code': 'print tan [:a]', 'to': 'print tan :a', 'logged': true},
	];
	processTestCases(cases, removeSquareBracketsForNumberArguments, logger);
};