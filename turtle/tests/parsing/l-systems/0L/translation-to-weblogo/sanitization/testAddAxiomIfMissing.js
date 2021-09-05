import { addAxiomIfMissing } from
'../../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/sanitization/addAxiomIfMissing.js';
import { processTestCases } from
'./processTestCases.js';

export function testAddAxiomIfMissing(logger) {
	const cases = [
		{'in': '', 'out': 'axiom='},
		{'in': 'x=F', 'out': 'axiom=\nx=F'},
		{'in': 'x->F', 'out': 'axiom=\nx->F'},
	];
	processTestCases(cases, addAxiomIfMissing, logger);
};