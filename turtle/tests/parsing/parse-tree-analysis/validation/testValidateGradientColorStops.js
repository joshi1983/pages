import { processValidationTestCases } from './processValidationTestCases.js';
import { validateGradientColorStops } from '../../../../modules/parsing/parse-tree-analysis/validation/validateGradientColorStops.js';

export function testValidateGradientColorStops(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'make "x createPList', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "#1234', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x 1 "blue', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\n' +
			'setProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\n' +
			'setProperty "x 0.5 [255 0 0]\n' +
			'setProperty "x 1 "blue\nmake "gradient createLinearGradient [0 0] [100 100] :x "pad\nsetFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x "1 "blue\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x 1 "blue\n' +
			'make "gradient createRadialGradient2 [0 0] [100 100] 100 :x "pad\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x 1 "blue\n' +
			'make "gradient createRadialGradient [0 0] 100 :x\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x "0 "red\nsetProperty "x 1 "blue\n' +
			'make "gradient createRadialGradient2 [0 0] [100 100] 100 :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x "0 "red\nsetProperty "x 1 "blue\n' +
			'make "gradient createRadialGradient [0 0] 100 :x\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x 1.1 "blue\n' +
			'make "gradient createRadialGradient2 [0 0] [100 100] 100 :x "pad\nsetFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x -0.1 "blue\n' +
			'make "gradient createRadialGradient2 [0 0] [100 100] 100 :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x -0.1 "blue\n' +
			'make "gradient createRadialGradient [0 0] 100 :x\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "#1234\nsetProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 transparent\nsetProperty "x 1 "blue\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "#1234\nsetProperty "x 1 ["blue easeEase]\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x 0 "#1234\nsetProperty "x 1 ["blue "easeEase]\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "#1234\nsetProperty "x 1 ["blue "easeEase 3]\n' +
			'make "gradient createLinearGradient [0 0] [100 100] :x "pad\n' +
			'setFillGradient :gradient', 'error': true},
	];
	processValidationTestCases(cases, logger, validateGradientColorStops);
};