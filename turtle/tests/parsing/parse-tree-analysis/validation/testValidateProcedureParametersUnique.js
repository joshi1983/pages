import { validateProcedureParametersUnique } from '../../../../modules/parsing/parse-tree-analysis/validation/validateProcedureParametersUnique.js';
import { processValidationTestCases } from './processValidationTestCases.js';

export function testValidateProcedureParametersUnique(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'to something\nend', 'error': false},
		{'code': 'to something :x\nend', 'error': false},
		{'code': 'to something :x :x\nend', 'error': true},
		{'code': 'to something :x :X\nend', 'error': true}, // case insensitive
		{'code': 'to something :X :x\nend', 'error': true}, // case insensitive
	];
	processValidationTestCases(cases, logger, validateProcedureParametersUnique);
};