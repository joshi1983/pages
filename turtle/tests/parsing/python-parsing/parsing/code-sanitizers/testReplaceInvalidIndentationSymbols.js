import { replaceInvalidIndentationSymbols } from
'../../../../../modules/parsing/python-parsing/parsing/code-sanitizers/replaceInvalidIndentationSymbols.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testReplaceInvalidIndentationSymbols(logger) {
	const cases = [
		{'in': 'x\ny', 'changed': false},
		{'in': 'x\r\ny', 'changed': false},
		{'in': '\tx\n\ty', 'changed': false},
		{'in': '\tx\r\n\ty', 'changed': false},
		{'in': ' x\n y', 'out': '\tx\n\ty'},
		{'in': 'x\n y', 'out': 'x\n\ty'},
		{'in': 'x\n  y', 'out': 'x\n\ty'},
		{'in': 'x\n       y', 'out': 'x\n\ty'},
		{'in': 'print(3)\n print(4)', 'out': 'print(3)\n\tprint(4)'},
	];
	testInOutPairs(cases, replaceInvalidIndentationSymbols, logger);
};