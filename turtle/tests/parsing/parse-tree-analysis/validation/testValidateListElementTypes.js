import { processValidationTestCase } from './processValidationTestCase.js';
import { validateListElementTypes } from '../../../../modules/parsing/parse-tree-analysis/validation/validateListElementTypes.js';

export function testValidateListElementTypes(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'setPos [1 2]', 'error': false},
		{'code': 'setPos [1 2 "hi]', 'error': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateListElementTypes);
	});
};