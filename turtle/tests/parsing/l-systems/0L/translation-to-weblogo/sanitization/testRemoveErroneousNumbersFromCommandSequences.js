import { processTestCases } from
'./processTestCases.js';
import { removeErroneousNumbersFromCommandSequences } from
'../../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/sanitization/removeErroneousNumbersFromCommandSequences.js';

export function testRemoveErroneousNumbersFromCommandSequences(logger) {
	const cases = [
		{'in': 'angle=3', 'out': 'angle=3'},
		{'in': 'angle=3.12', 'out': 'angle=3.12'},
		{'in': 'x->', 'out': 'x->'},
		{'in': 'x->F', 'out': 'x->F'},
		{'in': 'x->F3', 'out': 'x->F3'},
		{'in': 'x->3F', 'out': 'x->F'},
	];
	processTestCases(cases, removeErroneousNumbersFromCommandSequences, logger);
};