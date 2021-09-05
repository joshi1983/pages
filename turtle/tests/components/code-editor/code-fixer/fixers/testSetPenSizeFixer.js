import { processTestCase } from './processTestCase.js';
import { setPenSizeFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/setPenSizeFixer.js';

export function testSetPenSizeFixer(logger) {
	const cases = [
		{'code': 'setPenSize 1', 'logged': false},
		{'code': 'setPenSize [1 1]', 'to': 'setPenSize 1 ', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, setPenSizeFixer, logger);
	});
};