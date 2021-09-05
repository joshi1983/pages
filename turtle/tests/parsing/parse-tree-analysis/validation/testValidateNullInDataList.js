import { processValidationTestCase } from './processValidationTestCase.js';
import { validateNullInDataList } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateNullInDataList.js';

export function testValidateNullInDataList(logger) {
	const cases = [
		{'code': 'print [1]', 'error': false},
		{'code': 'make "x 5\nifelse randomRatio < 0.5 [print :x] []', 'error': false},
		{'code': 'print [penUp]', 'error': true},
		{'code': 'print [print "hi]', 'error': true},
		{'code': 'make "x 5\nprint ifelse randomRatio < 0.5 [print :x] []', 'error': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateNullInDataList);
	});
};