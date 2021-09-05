import { processTestCases } from '../processTestCases.js';
import { removeDoNothingCommandCalls } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/removeDoNothingCommandCalls.js';

export function testRemoveDoNothingCommandCalls(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print 4', 'logged': false},
		{'code': 'while true []', 'logged': false},
		{'code': 'while randomRatio < 0.3 [ print "hi ]', 'logged': false},
		{'code': 'setPos pos', 'to': ' ', 'logged': true},
		{'code': 'setPenSize penSize', 'to': ' ', 'logged': true},
		{'code': 'if false []', 'to': '  ', 'logged': true},
		{'code': 'if false [print "hi ]', 'to': '    ', 'logged': true},
		{'code': 'while false []', 'to': '  ', 'logged': true},
		{'code': 'while false [print "hi ]', 'to': '    ', 'logged': true},
		{'code': 'until true []', 'to': '  ', 'logged': true},
	];
	processTestCases(cases, removeDoNothingCommandCalls, logger);
};