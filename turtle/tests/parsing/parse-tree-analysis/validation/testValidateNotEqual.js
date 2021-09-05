import { processValidationTestCases } from './processValidationTestCases.js';
import { validateNotEqual } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateNotEqual.js';

export function testValidateNotEqual(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print getArcLeftAngleToLine 100 :x :y', 'error': false},
		{'code': 'print getArcLeftAngleToLine 100 :x :x', 'error': true},
		{'code': 'print getArcLeftAngleToLine 100 :x :X', 'error': true},
		{'code': 'print getArcLeftAngleToLine 100 :X :x', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 :X :x', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 [0 0 0] [0 0 0]', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 [0 0] [0 0]', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 pos pos', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 pos Pos', 'error': true},

		// The following would trigger data type validation errors too.
		// We want to know the errors are logged because the following would use the same
		// values for linePoint1 and linePoint2 anyway.
		{'code': 'print getArcRightAngleToLine 100 xCor xCor', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 yCor yCor', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 zCor zCor', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 penColor penColor', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 penSize penSize', 'error': true},
		{'code': 'print getArcRightAngleToLine 100 fillColor fillColor', 'error': true},
		{'code': 'print createLinearGradient pos pos :colorStops "pad', 'error': true},
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

	processValidationTestCases(cases, logger, validateNotEqual);
};