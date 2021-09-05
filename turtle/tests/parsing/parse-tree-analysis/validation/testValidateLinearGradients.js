import { processValidationTestCase } from './processValidationTestCase.js';
import { validateLinearGradients } from '../../../../modules/parsing/parse-tree-analysis/validation/validateLinearGradients.js';

export function testValidateLinearGradients(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\n' +
			'setProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\n' +
			'setProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient pos [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "p pos\nmake "x createPList\nsetProperty "x 0 "red\n' +
			'setProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient :p [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient pos pos :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient [0 0] [0 0] :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "p pos\nmake "x createPList\nsetProperty "x 0 "red\nsetProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient :p :p :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateLinearGradients);
	});
};