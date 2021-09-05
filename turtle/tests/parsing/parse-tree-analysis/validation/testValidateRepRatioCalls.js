import { processValidationTestCase } from './processValidationTestCase.js';
import { validateRepRatioCalls } from '../../../../modules/parsing/parse-tree-analysis/validation/validateRepRatioCalls.js';

export function testValidateRepRatioCalls(logger) {
	const cases = [
		{'code': 'repratio', 'error': true},
		{'code': 'print repratio', 'error': true},
		{'code': 'to hello\nrepratio\nend', 'error': true},
		{'code': 'to hello\nprint repratio\nend', 'error': true},
		{'code': 'repeat 5 [print repratio]', 'error': false},
		{'code': 'for ["x 1 5 1] [print repratio]', 'error': true},
		{'code': 'to hello\nrepeat 5 [print repratio]\nend', 'error': false}
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateRepRatioCalls);
	});
};