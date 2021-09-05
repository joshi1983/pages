import { processValidationTestCase } from './processValidationTestCase.js';
import { validateRefTypes } from '../../../../modules/parsing/parse-tree-analysis/validation/validateRefTypes.js';

export function testValidateRefTypes(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'setProperty "bla "x 5', 'error': true},
		{'code': 'make "bla plistCreate\nsetProperty "bla "x 5', 'error': false},
		{'code': 'queue "x 1', 'error': true}, // undefined variable x.
		{'code': 'make "x []\nqueue "x 1', 'error': false},
		{'code': 'make "x []\nqueue "X 1', 'error': false},
		// this should be fine because variable names are case-insensitive.

		{'code': 'to f\nqueue "x 1\nend\nf', 'error': true},
		// undeclared varible x in a procedure.

		{'code': 'to f\nlocalmake "x []\nqueue "x 1\nend\nf', 'error': false}, 
		// declared local varible x in a procedure so that's fine.
		
		{'code': 'to f :x\nqueue "x 1\nend\nf []', 'error': false},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateRefTypes);
	});
};