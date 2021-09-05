import { processTestCases } from '../processTestCases.js';
import { removeImportsFixer } from '../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/removeImportsFixer.js';

export function testRemoveImportsFixer(logger) {
	const cases = [
		{'code': 'print "Define', 'logged': false},
		{'code': 'import', 'logged': false},
		{'code': 'import x', 'to': ' ', 'logged': true},
		{'code': 'import x\nfd 100', 'to': ' \nfd 100', 'logged': true},
		{'code': 'import fd 100', 'logged': false},
	];
	processTestCases(cases, removeImportsFixer, logger);
};