import { processScanTokenProcessCases } from
'./processScanTokenProcessCases.js';
import { removeUnbalancedClosingBrackets } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/scanning/removeUnbalancedClosingBrackets.js';

export function testRemoveUnbalancedClosingBrackets(logger) {
	const cases = [
		{'code': ')', 'tokens': []},
		{'code': ']', 'tokens': []},
		{'code': 'end', 'tokens': []},
		{'code': 'to', 'tokens': ['to', 'end']},
		{'code': 'rpt 3 [to', 'tokens': ['rpt', '3', '[', ']', 'to', 'end']},
		{'code': '()', 'tokens': ['(', ')']},
		{'code': '[]', 'tokens': ['[', ']']},
		{'code': 'repeat 3 []', 'tokens': ['repeat', '3', '[', ']']},
		{'code': 'repeat 3 [', 'tokens': ['repeat', '3', '[', ']']},
		{'code': 'to end', 'tokens': ['to', 'end']},
		{'code': '(]', 'tokens': ['(', ')']},
		{'code': '[)', 'tokens': ['[', ']']},
		{'code': '[end', 'tokens': ['[', ']']},
		{'code': 'to)', 'tokens': ['to', 'end']},
		{'code': '(]', 'tokens': ['(', ')']},
		{'code': 'To p rpt 20 [  end', 'tokens': ['To', 'p', 'rpt', '20', '[', ']', 'end']}
	];
	processScanTokenProcessCases(cases, removeUnbalancedClosingBrackets, logger);
};