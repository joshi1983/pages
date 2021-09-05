import { processValidationTestCase } from './processValidationTestCase.js';
import { validateNumberRanges } from '../../../../modules/parsing/parse-tree-analysis/validation/validateNumberRanges.js';

export function testValidateNumberRanges(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'fd 100', 'error': false},
		{'code': 'print sqrt 0.1', 'error': false},
		{'code': 'repeat 3 [print "hi]', 'error': false},
		{'code': 'print []', 'error': false},
		{'code': 'print item 1 [1 2]', 'error': false},
		{'code': 'repeat 0 [print "hi]', 'error': true},
		{'code': 'print sqrt -1', 'error': true},
		{'code': 'print item 0 [1 2]', 'error': true},
		{'code': 'print item 1 - 1 [1 2]', 'error': true}, // 1 - 1 evaluates to 0.
		{'code': 'print char -1', 'error': true},
		{'code': 'print char 0', 'error': false},
		{'code': 'print char 100', 'error': false},
		{'code': 'print char 255', 'error': false},
		{'code': 'print char 256', 'error': true},
		{'code': 'print char 1000', 'error': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateNumberRanges);
	});
};