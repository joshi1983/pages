import { processTestCases } from '../processTestCases.js';
import { removeUnreferencedLabelsFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/removeUnreferencedLabelsFixer.js';

export function testRemoveUnreferencedLabelsFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'x: goto x', 'logged': false},
		{'code': 'x:', 'to': '', 'logged': true},
	];
	processTestCases(cases, removeUnreferencedLabelsFixer, logger);
};