import { processValidationTestCases } from './processValidationTestCases.js';
import { validateListElementTypes } from '../../../../modules/parsing/parse-tree-analysis/validation/validateListElementTypes.js';

export function testValidateListElementTypes(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'setPos [1 2]', 'error': false},
		{'code': 'setPos [-1.5 2.3]', 'error': false},
		{'code': 'setPos [1 2 "hi]', 'error': true},
		{'code': 'setPos ["hi]', 'error': true},
		{'code': 'jumpTo [1 2 "hi]', 'error': true},
		{'code': 'jumpTo [1 "hi]', 'error': true},
		{'code': 'jumpTo ["hi]', 'error': true},
	];
	processValidationTestCases(cases, logger, validateListElementTypes);
};