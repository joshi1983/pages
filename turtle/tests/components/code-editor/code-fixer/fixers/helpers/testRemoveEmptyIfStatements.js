import { removeEmptyIfStatements } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/removeEmptyIfStatements.js';
import { processTestCases } from '../processTestCases.js';

export function testRemoveEmptyIfStatements(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'if', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'if true', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'if true [print "yo ]', 'logged': false},
		{'code': 'ifelse true [] [print "hi ]', 'logged': false},
		{'code': 'ifelse true [print "yo ] [print "hi ]', 'logged': false},
		{'code': 'ifelse true [print "yo ] []', 'logged': false},
		{'code': 'if true []', 'to': '  ', 'logged': true},
		{'code': 'ifelse true [] []', 'to': '   ', 'logged': true},
	];
	processTestCases(cases, removeEmptyIfStatements, logger);
};