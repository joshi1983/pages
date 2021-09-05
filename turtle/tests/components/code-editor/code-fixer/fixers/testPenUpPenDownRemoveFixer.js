import { penUpPenDownRemoveFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/penUpPenDownRemoveFixer.js';
import { processTestCases } from './processTestCases.js';

export function testPenUpPenDownRemoveFixer(logger) {
	const cases = [
		{'code': 'fd 100', 'logged': false},
		{'code': 'to p\npenDown\nend\npenup p forward 10', 'logged': false},
		{'code': 'penUp', 'to': '', 'logged': true},
	];
	processTestCases(cases, penUpPenDownRemoveFixer, logger);
};