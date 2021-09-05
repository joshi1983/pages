import { clashingProcedureNameFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { processTestCases } from './processTestCases.js';

export function testClashingProcedureNameFixer(logger) {
	const cases = [
		{'code': 'to p\nend', 'logged': false},
		{'code': 'to fd\nend', 'to': `to fd2
end`, 'logged': true},
		{'code': 'to fd\nend\nfd 3', 'to': `to fd2
end
fd 3`, 'to': 'to fd\nend',
'to': `to fd2
end
fd2 3`, 'logged': true},
	];
	processTestCases(cases, clashingProcedureNameFixer, logger);
};