import { processValidationTestCase } from './processValidationTestCase.js';
import { validateRepcountCalls } from '../../../../modules/parsing/parse-tree-analysis/validation/validateRepcountCalls.js';

export function testValidateRepcountCalls(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print 4', 'error': false},
		{'code': 'repcount', 'error': true},
		{'code': 'print repcount', 'error': true},
		{'code': 'to hello\nrepcount\nend', 'error': true},
		{'code': 'to hello\nprint repcount\nend', 'error': true},
		{'code': 'repeat 5 [print repcount]', 'error': false},
		{'code': 'for ["x 1 5 1] [print repcount]', 'error': true},
		{'code': 'to hello\nrepeat 5 [print repcount]\nend', 'error': false}
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateRepcountCalls);
	});
};