import { processTestCases } from
'./processTestCases.js';
import { removeUndefinedIdentifiersFromCommandSequences } from
'../../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/sanitization/removeUndefinedIdentifiersFromCommandSequences.js';

export function testRemoveUndefinedIdentifiersFromCommandSequences(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'x=F', 'out': 'x=F'},
		{'in': 'x->Fx', 'out': 'x->Fx'},
		{'in': 'x->Fy', 'out': 'x->F'}, // y removed because it has no asscoiated arrow/substitution rule.
	];
	processTestCases(cases, removeUndefinedIdentifiersFromCommandSequences, logger);
};