import { processTestCases } from './processTestCases.js';
import { setPenSizeFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/setPenSizeFixer.js';

export function testSetPenSizeFixer(logger) {
	const cases = [
		{'code': 'setPenSize 1', 'logged': false},
		{'code': 'setPenSize [1 1]', 'to': 'setPenSize 1 ', 'logged': true},
		{'code': 'setPenSize [:a :a]', 'to': 'setPenSize :a ', 'logged': true},
	];
	processTestCases(cases, setPenSizeFixer, logger);
};