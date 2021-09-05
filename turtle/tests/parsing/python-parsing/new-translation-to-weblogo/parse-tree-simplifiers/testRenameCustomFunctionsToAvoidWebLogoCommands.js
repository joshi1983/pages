import { processTestCases } from './processTestCases.js';
import { renameCustomFunctionsToAvoidWebLogoCommands } from
'../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/renameCustomFunctionsToAvoidWebLogoCommands.js';

export function testRenameCustomFunctionsToAvoidWebLogoCommands(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'def', 'changed': false},
		{'code': 'def:', 'changed': false},
		{'code': 'def f:', 'changed': false},
		{'code': 'def f():', 'changed': false},
		{'code': 'def circle():', 'out': 'def circle1():'},
		{'code': 'def circle():\n\tpass\n\ncircle()',
			'out': 'def circle1():\n\tpass\n\ncircle1()'},
		{'code': 'def circle():\n\tpass\n\ncircle(1,2,3)',
			'out': 'def circle1():\n\tpass\n\ncircle(1,2,3)'},
	];
	processTestCases(cases, renameCustomFunctionsToAvoidWebLogoCommands, logger);
};