import { processValidationTestCases } from './processValidationTestCases.js';
import { validateOutstandinglyLongProcedures } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateOutstandinglyLongProcedures.js';

export function testValidateOutstandinglyLongProcedures(logger) {
	const cases = [
		{'code': '', 'error': false, 'warn': false},
		{'code': 'to p\nend', 'error': false, 'warn': false},
		{'code': 'to p' + '\n'.repeat(190) + 'end', 'error': false, 'warn': false},
		{'code': 'to p' + '\n'.repeat(202) + 'end', 'error': false, 'warn': true},
	];
	processValidationTestCases(cases, logger, validateOutstandinglyLongProcedures);
};