import { processTestCase } from './processTestCase.js';
import { quoteBooleanFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/quoteBooleanFixer.js';

export function testQuoteBooleanFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'and true false', 'logged': false},
		{'code': 'and true "false', 'to': 'and true false', 'logged': true},
		{'code': 'and "true "false', 'to': 'and true false', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, quoteBooleanFixer, logger);
	});
};