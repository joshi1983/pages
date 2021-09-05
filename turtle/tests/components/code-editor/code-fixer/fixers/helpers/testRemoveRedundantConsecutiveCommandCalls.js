import { processTestCases } from '../processTestCases.js';
import { removeRedundantConsecutiveCommandCalls } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/removeRedundantConsecutiveCommandCalls.js';

export function testRemoveRedundantConsecutiveCommandCalls(logger) {
	const cases = [
		{'code': '',
			'logged': false
		},
		{'code': 'setPenSize 10',
			'logged': false
		},
		{'code': 'setPenColor "red',
			'logged': false
		},
		{'code': 'setPenColor "red\nsetPenSize 10',
			'logged': false
		},
		{'code': 'setPenSize 10\nsetPenSize 4',
			'to': ' \nsetPenSize 4',
			'logged': true
		},
		{'code': 'setPenColor "red\nsetPenColor "blue',
			'to': ' \nsetPenColor "blue',
			'logged': true
		},
	];
	processTestCases(cases, removeRedundantConsecutiveCommandCalls, logger);
};