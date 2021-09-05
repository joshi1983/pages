import { procedureNameOnWrongLineFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/procedureNameOnWrongLineFixer.js';
import { processTestCases } from './processTestCases.js';

export function testProcedureNameOnWrongLineFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'to', 'logged': false},
		{'code': 'to 4', 'logged': false},
		{'code': 'to false', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'to true', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'to :x', 'logged': false, 'ignoreParseErrors': true},
		{'code': 'to x', 'logged': false},
		{'code': 'to p :x', 'logged': false},
		{'code': 'to p\nend\nto\np\nend',
			'logged': false, 'ignoreParseErrors': true},
		{'code': 'to\nprint :x\nend',
			'logged': false, 'ignoreParseErrors': true},
		{'code': 'to p :x\nend', 'logged': false},
		{'code': 'to\np :x\nend',
			'to': 'to p :x\n \nend',
			'logged': true, 'ignoreParseErrors': true},
		{'code': 'to; some comment\np :x\nend',
			'to': 'to p :x; some comment\n \nend',
			'logged': true, 'ignoreParseErrors': true},
	];
	processTestCases(cases, procedureNameOnWrongLineFixer, logger);
};