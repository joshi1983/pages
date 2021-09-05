import { processValidationTestCases } from './processValidationTestCases.js';
import { validateUnrecognizedParameterizedGroupNames } from '../../../../modules/parsing/parse-tree-analysis/validation/validateUnrecognizedParameterizedGroupNames.js';

export function testValidateUnrecognizedParameterizedGroupNames(logger) {
	const cases = [
		{'code': 'fd 100', 'error': false},
		{'code': 'return 100', 'error': true},
		{'code': 'ldfkdjf', 'error': true},
		{'code': 'print 0.23.5', 'error': true},
		{'code': 'print [sum 1 2]', 'error': false},
		{'code': 'print [hello world]', 'error': true}, // unrecognized "hello".  unrecognized "world".
		{'code': 'to hi\n repeat 3 [print repcount]\n end\n hi', 'error': false},
		{'code': 'to hi\n repeat 3 [print repcount]\n end\n hi2', 'error': true}, // unrecognized hi2
		{'code': 'to p\nfor ["x 0 5 1] [\nif :x > 2 [\nreturn 1\n]\n]\nend', 'error': true}, // consider to use "output" instead of "return".
		{'code': 'to p\nto q\nend', 'error': false}, // contains an error but it should be found by a different validator.
	];
	processValidationTestCases(cases, logger, validateUnrecognizedParameterizedGroupNames);
};