import { paramLineFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/paramLineFixer.js';
import { processTestCases } from './processTestCases.js';

export function testParamLineFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'to p\nend', 'logged': false},
		{'code': 'to p :x\nend', 'logged': false},
		{'code': 'to p end', 'to': 'to p\nend', 'logged': true},
		{'code': 'to p fd 3 end', 'to': 'to p\nfd 3 end', 'logged': true},
	];
	processTestCases(cases, paramLineFixer, logger);
};