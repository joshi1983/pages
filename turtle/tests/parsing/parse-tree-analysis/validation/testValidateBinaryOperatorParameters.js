import { processValidationTestCases } from './processValidationTestCases.js';
import { validateBinaryOperatorParameters } from '../../../../modules/parsing/parse-tree-analysis/validation/validateBinaryOperatorParameters.js';

export function testValidateBinaryOperatorParameters(logger) {
	const cases = [
		// These expressions should make a warning but not an error and only with other
		// validation checks such as validateIndependentlyUseful.
		{'code': '1+2', 'error': false},
		{'code': '3/1', 'error': false},
		{'code': '3<>1', 'error': false},

		{'code': 'print 1+2', 'error': false},
		{'code': 'print 3/1', 'error': false},
		{'code': 'print 3/0', 'warn': true, 'error': false},
		{'code': '1+true', 'error': true},
		{'code': 'false + 1', 'error': true},
		{'code': '+', 'error': true},
		{'code': '*', 'error': true},
		{'code': '/', 'error': true},
		{'code': '<', 'error': true},
		{'code': '>=', 'error': true},
		{'code': '<=', 'error': true},
		{'code': '=', 'error': true},
		{'code': '<>', 'error': true},
		{'code': '*3', 'error': true},
		{'code': '1*', 'error': true},
		{'code': 'to p\noutput 5\nend\nprint 1 * p', 'error': false},
		{'code': 'to p\noutput "Hello\nend\nprint 1 * p', 'error': true},
		{'code': 'to FibonacciList :n\nlocalmake "a 0\nlocalmake "b 1\nlocalmake "result []\nrepeat :n [\nlocalmake "result rput :a :result\nlocalmake "previousa :a\nlocalmake "a :b\nlocalmake "b :previousa + :b\n]\noutput :result\nend', 'error': false},
		{'code': `make "offsets [60 90 120]
make "points []
queue2 "points pos
repeat 2 [
	repeat count :offsets [
		print 3 + (item repcount :offsets)
	]
]`, 'error': false}
	];

	processValidationTestCases(cases, logger, validateBinaryOperatorParameters);
};