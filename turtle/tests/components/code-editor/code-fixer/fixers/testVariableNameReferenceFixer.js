import { variableNameReferenceFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/variableNameReferenceFixer.js';
import { processTestCase } from './processTestCase.js';

export function testVariableNameReferenceFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'make :x 5', 'to': 'make "x 5', 'logged': true},
		{'code': 'make :x "x', 'to': 'make "x "x', 'logged': true},
		{'code': 'make x 5', 'to': 'make "x 5', 'logged': true},
		{'code': 'make " 5', 'logged': false},
		{'code': 'make " "x', 'logged': false},
		{'code': 'make " :x', 'logged': false},
		{'code': 'make " x', 'logged': false},
		{'code': 'print :x + x:y', 'logged': false},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, variableNameReferenceFixer, logger);
	});
};