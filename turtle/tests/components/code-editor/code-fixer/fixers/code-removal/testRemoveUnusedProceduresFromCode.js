import { removeUnusedProceduresFromCode } from
	'../../../../../../modules/components/code-editor/code-fixer/fixers/code-removal/removeUnusedProceduresFromCode.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testRemoveUnusedProceduresFromCode(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'to f\n\n\nrepeat count :list2 [\nlocalmake "item item repcount :list2\n\nprint :item \n]\n\n\nend\nf',
	'out': 'to f\n\n\nrepeat count :list2 [\nlocalmake "item item repcount :list2\n\nprint :item \n]\n\n\nend\nf'},
	{'in': 'to f :x\nend\nf',
	'changed': false} // assume the f is intended as a call to procedure f even if it doesn't have enough parameters.
	];
	testInOutPairs(cases, removeUnusedProceduresFromCode, logger);
};