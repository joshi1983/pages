import { processTestCases } from '../processTestCases.js';
import { removeDoNothingCommandCalls } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/removeDoNothingCommandCalls.js';

export function testRemoveDoNothingCommandCalls(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print 4', 'logged': false},
		{'code': 'setPos pos', 'to': ' ', 'logged': true},
		{'code': 'setPenSize penSize', 'to': ' ', 'logged': true},
	];
	processTestCases(cases, removeDoNothingCommandCalls, logger);
};