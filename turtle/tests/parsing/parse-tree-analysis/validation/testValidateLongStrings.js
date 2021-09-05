import { processValidationTestCase } from './processValidationTestCase.js';
import { validateLongStrings } from '../../../../modules/parsing/parse-tree-analysis/validation/validateLongStrings.js';

export function testValidateLongStrings(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': "print 'hello world'", 'error': false},
		{'code': "print 'hello world", 'error': true},
		{'code': "print '", 'error': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateLongStrings);
	});
};