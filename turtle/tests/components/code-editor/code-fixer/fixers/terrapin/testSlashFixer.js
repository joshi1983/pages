import { slashFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/slashFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testSlashFixer(logger) {
	const cases = [
		{'code': 'SETBG 0 \\', 'to': 'SETBG 0 ', 'logged': true},
	];
	processTestCases(cases, slashFixer, logger);
};