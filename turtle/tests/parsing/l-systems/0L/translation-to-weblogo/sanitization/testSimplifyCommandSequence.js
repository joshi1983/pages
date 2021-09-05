import { processTestCases } from
'./processTestCases.js';
import { simplifyCommandSequence } from
'../../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/sanitization/simplifyCommandSequence.js';

export function testSimplifyCommandSequence(logger) {
	const cases = [
		{'in': 'x->', 'out': 'x->'},
		{'in': 'x->F', 'out': 'x->F'},
		{'in': 'x->[', 'out': 'x->['},
		{'in': 'x->+-2', 'out': 'x->+-2'},
		{'in': 'x->[]', 'out': 'x->'},
		{'in': 'x->+-', 'out': 'x->'},
		{'in': 'x->&&', 'out': 'x->'},
		{'in': 'x->&&F', 'out': 'x->F'},
		{'in': 'x->&&||', 'out': 'x->'},
		{'in': 'x->|||', 'out': 'x->|'},
		{'in': 'x->||||', 'out': 'x->'},
		{'in': 'x->||||||', 'out': 'x->'},
		{'in': 'x->F[]', 'out': 'x->F'},
	];
	processTestCases(cases, simplifyCommandSequence, logger);
};