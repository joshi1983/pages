import { processTestCases } from './processTestCases.js';
import { webTurtleCommandFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/webTurtleCommandFixer.js';

export function testWebTurtleCommandFixer(logger) {
	const cases = [
		{'code': 'REPEAT 180[]', 'logged': false},
		{
			'code': 'LET $C BLACK\nLET $M flower\ndraw 10\nmove 5',
			'to': 'make "$C BLACK\nmake "$M flower\nforward 10\njumpForward 5',
			'logged': true
		},
		{
			'code': 'LET $C BLACK\ndraw 10\nmove 5\nEND',
			'to': 'make "$C BLACK\nforward 10\njumpForward 5\n',
			'logged': true
		},
	];
	processTestCases(cases, webTurtleCommandFixer, logger);
};