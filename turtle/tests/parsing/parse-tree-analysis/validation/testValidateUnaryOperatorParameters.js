import { validateUnaryOperatorParameters } from '../../../../modules/parsing/parse-tree-analysis/validation/validateUnaryOperatorParameters.js';
import { processValidationTestCase } from './processValidationTestCase.js';

export function testValidateUnaryOperatorParameters(logger) {
	const cases = [
		// These expressions should make a warning but not an error and only with other
		// validation checks such as validateIndependentlyUseful.
		{'code': '-1', 'error': false},

		{'code': 'make "x 5\nprint -:x', 'error': false},
		{'code': 'make "x "hi\nprint -:x', 'error': true},
		{'code': 'to p\noutput 5\nend print -p', 'error': false},
		{'code': 'to p\noutput "Hi\nend print -p', 'error': true},
	];

	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateUnaryOperatorParameters);
	});
};