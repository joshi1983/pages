import { instructionListSquareBracketsRemoveFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/instructionListSquareBracketsRemoveFixer.js';
import { processTestCases } from './processTestCases.js';

export function testInstructionListSquareBracketsRemoveFixer(logger) {
	const cases = [
	{'code': 'forward 100', 'logged': false},
	{'code': 'repeat 2 []', 'logged': false},
	{'code': 'repeat 2 [jumpForward 100]', 'logged': false},
	{'code': 'to p\nend', 'logged': false},
	{'code': '[forward 100]', 'to': 'forward 100', 'logged': true},
	{'code': '[fd 100', 'to': 'fd 100', 'logged': true},
	];
	processTestCases(cases, instructionListSquareBracketsRemoveFixer, logger);
};