import { ifInstructionListFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/ifInstructionListFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testIfInstructionListFixer(logger) {
	const cases = [
	{'code': 'IF true []', 'logged': false},
	{'code': 'IF true then []', 'logged': false},
	{'code': 'IF true then PD', 'logged': false},
	{'code': 'IF OR (XCOR < 300) (YCOR < 300) PD',
	'to': 'IF OR (XCOR < 300) (YCOR < 300) [PD]',
	'logged': true},
	];
	processTestCases(cases, ifInstructionListFixer, logger);
};