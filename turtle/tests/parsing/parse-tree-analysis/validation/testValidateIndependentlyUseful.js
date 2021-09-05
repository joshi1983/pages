import { processValidationTestCase } from './processValidationTestCase.js';
import { validateIndependentlyUseful } from '../../../../modules/parsing/parse-tree-analysis/validation/validateIndependentlyUseful.js';

export function testValidateIndependentlyUseful(logger) {
	const cases = [
		{'code': '', 'warn': false, 'error': false},
		{'code': 'fd 10', 'warn': false, 'error': false},
		{'code': 'hideturtle', 'warn': false, 'error': false},
		{'code': 'penup', 'warn': false, 'error': false},
		{'code': 'pendown', 'warn': false, 'error': false},
		{'code': 'and 10 5', 'warn': true, 'error': false},
		{'code': '10 + 5', 'warn': true, 'error': false},
		{'code': '10', 'warn': true, 'error': false},
		{'code': '[]', 'warn': true, 'error': false},
		{'code': '(sum 3 4 5)', 'warn': true, 'error': false},
		{'code': 'to p\nend', 'warn': false, 'error': false},
		{'code': 'to p\nfd 10\nend', 'warn': false, 'error': false},
		{'code': 'to p\n10+5\nend', 'warn': true, 'error': false},
		{'code': 'to p\n10\nend', 'warn': true, 'error': false},
		{'code': 'to p\n[]\nend', 'warn': true, 'error': false},
		{'code': 'to p\n[]\n[]\nend', 'warn': true, 'error': false},
		{'code': 'to p\n(sum 3 4 5)\nend', 'warn': true, 'error': false},
		{'code': 'to p\n(sum 3 4 5)\n(sum 3 4 5)\nend', 'warn': true, 'error': false}
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateIndependentlyUseful);
	});
};