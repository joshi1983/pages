import { processValidationTestCase } from './processValidationTestCase.js';
import { validateProcedureInProcedure } from '../../../../modules/parsing/parse-tree-analysis/validation/validateProcedureInProcedure.js';

export function testValidateProcedureInProcedure(logger) {
	const cases = [
		{'code': 'fd 100', 'error': false},
		{'code': 'to p\nend', 'error': false},
		{'code': 'to p\nto q\nend', 'error': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateProcedureInProcedure);
	});
};