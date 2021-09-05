import { endifFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/endifFixer.js';
import { processTestCase } from './processTestCase.js';

export function testEndIfFixer(logger) {
	const cases = [
		{'code': 'if 1 < random 2 []', 'logged': false},
		{'code': 'if 1 < random 2 endif', 'to': 'if 1 < random 2 []', 'logged': true},
		{'code': 'if 1 < random 2 forward 10 endif', 'to': 'if 1 < random 2 [forward 10 ]', 'logged': true},
		{'code': 'if 1 < random 2 forward 10 right 90 endif', 'to': 'if 1 < random 2 [forward 10 right 90 ]', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, endifFixer, logger);
	});
};