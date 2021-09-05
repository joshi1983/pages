import { processValidationTestCase } from './processValidationTestCase.js';
import { validateItemUsage } from '../../../../modules/parsing/parse-tree-analysis/validation/validateItemUsage.js';

export function testValidateItemUsage(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'make "x [1 2]\nprint item 1 :x', 'error': false},
		{'code': 'make "x [1 2]\nprint item 2 :x', 'error': false},
		{'code': 'print item 1 [4 5 2]', 'error': false},
		{'code': 'print item 1 "hello', 'error': false}, // prints h
		{'code': 'print item 1 "h', 'error': false}, // prints h
		{'code': 'print item 2 "h', 'error': true},
		{'code': 'print item 2 \'h\'', 'error': true},
		{'code': 'make "x [1]\nprint item 2 :x', 'error': true},
		{'code': 'make "x "h\nprint item 2 :x', 'error': true},
		{'code': 'print item 3 [4 5]', 'error': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateItemUsage);
	});
};