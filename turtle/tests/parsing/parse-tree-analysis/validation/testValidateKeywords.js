import { processValidationTestCase } from './processValidationTestCase.js';
import { validateKeywords } from '../../../../modules/parsing/parse-tree-analysis/validation/validateKeywords.js';

export function testValidateKeywords(logger) {
	const cases = [
		{'code': 'to f\nend', 'error': false},
		{'code': 'to', 'error': true},
		{'code': 'end', 'error': true}
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateKeywords);
	});
};