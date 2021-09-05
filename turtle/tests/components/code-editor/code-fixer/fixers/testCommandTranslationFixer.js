import { commandTranslationFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/commandTranslationFixer.js';
import { processTestCase } from './processTestCase.js';

export function testCommandTranslationFixer(logger) {
	const cases = [
		{'code': 'pc', 'logged': false},
		{'code': 'pc 5', 'to': 'setPenColor 5', 'logged': true},
		{'code': 'fd 100', 'logged': false},
		{'code': 'print "pc', 'logged': false},
		{'code': 'print pc', 'logged': false},
		{'code': 'print ["pc 5]', 'logged': false},
	];
	cases.forEach(function(caseInfo) {
		processTestCase(caseInfo, commandTranslationFixer, logger);
	});
};