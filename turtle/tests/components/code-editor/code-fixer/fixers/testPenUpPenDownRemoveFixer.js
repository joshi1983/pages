import { processTestCase } from './processTestCase.js';
import { penUpPenDownRemoveFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/penUpPenDownRemoveFixer.js';

export function testPenUpPenDownRemoveFixer(logger) {
	const cases = [
		{'code': 'fd 100', 'logged': false},
		{'code': 'to p\npenDown\nend\npenup p forward 10', 'logged': false},
		{'code': 'penUp', 'to': '', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, penUpPenDownRemoveFixer, logger);
	});
};