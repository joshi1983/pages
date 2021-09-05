import { doTimesFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/doTimesFixer.js';
import { processTestCases } from './processTestCases.js';

export function testDoTimesFixer(logger) {
	const cases = [
		{'code': 'dotimes', 'logged': false},
		{'code': 'dotimes []', 'logged': false},
		{'code': 'dotimes [x]', 'logged': false},
		{'code': 'dotimes [x 5]', 'logged': false},
		{'code': 'dotimes [x 5] []', 'logged': true, 'to': 'for ["x 0 4] []'},
		{'code': 'dotimes ["x 5] []', 'logged': true, 'to': 'for ["x 0 4] []'},
		{'code': 'dotimes [x 5] [print :x]', 'logged': true, 'to': 'for ["x 0 4] [print :x]'},
		{'code': 'dotimes [x 15] [print :x]', 'logged': true, 'to': 'for ["x 0 14] [print :x]'},
		{'code': 'dotimes [Y 15] [print :Y]', 'logged': true, 'to': 'for ["Y 0 14] [print :Y]'},
	];
	processTestCases(cases, doTimesFixer, logger);
};