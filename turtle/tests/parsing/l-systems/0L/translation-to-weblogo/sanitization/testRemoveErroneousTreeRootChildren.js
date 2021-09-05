import { processTestCases } from
'./processTestCases.js';
import { removeErroneousTreeRootChildren } from
'../../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/sanitization/removeErroneousTreeRootChildren.js';

export function testRemoveErroneousTreeRootChildren(logger) {
	const cases = [
		{'in': 'axiom=F', 'changed': false},
		{'in': 'X->F', 'changed': false},
		{'in': '3', 'out': ''},
		{'in': '3.12', 'out': ''},
		{'in': '=', 'out': ''},
		{'in': '->', 'out': ''},
	];
	processTestCases(cases, removeErroneousTreeRootChildren, logger);
};