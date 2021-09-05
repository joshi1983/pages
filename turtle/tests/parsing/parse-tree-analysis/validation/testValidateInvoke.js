import { processValidationTestCases } from './processValidationTestCases.js';
import { validateInvoke } from '../../../../modules/parsing/parse-tree-analysis/validation/validateInvoke.js';

export function testValidateInvoke(logger) {
	const cases = [
		{'code': 'to f\nend', 'error': false},
		{'code': 'print (invoke "sum 1 3)', 'error': false},
		{'code': 'print (invoke "sum 1 2 3 4 5)', 'error': false},
		{'code': 'print (invoke "minus 1)', 'error': true},
		{'code': 'print (invoke "print 1)', 'error': true},
		{'code': 'print (invoke "for 1)', 'error': true},
		{'code': 'to p\nend\nprint (invoke "p)', 'error': false},
		{'code': 'to p :x\nend\nprint (invoke "p 1)', 'error': false},
		{'code': 'to p :x\nend\nprint (invoke "p 1 2)', 'error': true},
		{'code': 'print invoke "sum 1 3', 'error': true, 'warn': false},
		{'code': 'print (sum 1 invoke "sum 1 3)', 'error': true, 'warn': false},
	];
	processValidationTestCases(cases, logger, validateInvoke);
};