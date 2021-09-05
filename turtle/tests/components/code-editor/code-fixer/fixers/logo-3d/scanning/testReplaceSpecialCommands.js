import { processScanTokenProcessCases } from
'./processScanTokenProcessCases.js';
import { replaceSpecialCommands } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/scanning/replaceSpecialCommands.js';

/*
'lt' sometimes refers to 'left' in Logo3D.
'lt' sometimes refers to 'less than' or '<' in Logo3D.
This tests that appropriate changes are made by replaceSpecialCommands to make these interpretations clearer.
*/
export function testReplaceSpecialCommands(logger) {
	const cases = [
		{'code': 'lt 4', 'tokens': ['lt', '4']}, // remain unchanged because lt likely refers to WebLogo's 'left' command.
		{'code': 'if x lt 4', 'tokens': ['if', 'x', '<', '4']},
			// 'lt' would make no sense as 'left' here.
			// The 'lt' would need to be directly in an instruction list but it clearly is not.
		{'code': 'IF x LT 4', 'tokens': ['IF', 'x', '<', '4']}, // should be case-insensitive.
		{'code': 'if\nx\nlt 4', 'tokens': ['if', '\n', 'x', '\n', '<', '4']}, // line breaks shouldn't prevent the changes from happening.
		{'code': 'IF x GT 4', 'tokens': ['IF', 'x', '>', '4']},
		{'code': 'while x lt 4', 'tokens': ['while', 'x', '<', '4']},
		{'code': 'WHILE x LT 4', 'tokens': ['WHILE', 'x', '<', '4']}, // case insensitive
		{'code': 'WHILE x GT 4', 'tokens': ['WHILE', 'x', '>', '4']},
		{'code': 'if 3 + c lt 10 []', 'tokens': ['if', '3', '+', 'c', '<', '10', '[', ']']},
		{'code': 'if 3 + c lt 10 \n[]', 'tokens': ['if', '3', '+', 'c', '<', '10', '\n', '[', ']']},
	];
	processScanTokenProcessCases(cases, replaceSpecialCommands, logger);
};