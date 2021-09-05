import { processTestCase } from './processTestCase.js';
import { useStrFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/useStrFixer.js';

export function testUseStrFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'label 5', 'logged': false}, // let the quoteNumberFixer and quoteIntegerFixer handle number literals.
		{'code': 'label 4+random 4', 'to': 'label str 4+random 4', 'logged': true},
		{'code': 'repeat 2[label repcount]', 'to': 'repeat 2[label str repcount]', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, useStrFixer, logger);
	});
};