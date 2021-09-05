import { globalLocalmakeFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/globalLocalmakeFixer.js';
import { processTestCases } from './processTestCases.js';

export function testGlobalLocalmakeFixer(logger) {
	const cases = [
		{'code': 'make "x 3', 'logged': false},
		{'code': 'to p\nlocalmake "x 3\nend', 'logged': false},
		{'code': 'localmake "x 3', 'logged': true, 'to': 'make "x 3'},
	];
	processTestCases(cases, globalLocalmakeFixer, logger);
};