import { processValidationTestCase } from './processValidationTestCase.js';
import { validateProcedureParametersNotNull } from '../../../../modules/parsing/parse-tree-analysis/validation/validateProcedureParametersNotNull.js';

export function testValidateProcedureParametersNotNull(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'to hello\nend\nhello', 'error': false}, // no parameters.  no problem.
		{'code': 'to hello :x\nprint :x\nend\nhello 10', 'error': false}, // 10 is not null so no problem.
		{'code': 'to hello :x\nprint :x\nend\nhello pensize', 'error': false}, // pensize does not return null so no problem.
		{'code': 'to hello :x\nprint :x\nend\nhello penup', 'error': true}, // penup returns null so we have a problem.
		{'code': 'to hello :x\nprint :x\nend\nhello fd 10', 'error': true}, // "fd 10" returns null so we have a problem.
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateProcedureParametersNotNull);
	});
};