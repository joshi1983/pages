import { processValidationTestCase } from './processValidationTestCase.js';
import { validateAnimationTimeUsage } from '../../../../modules/parsing/parse-tree-analysis/validation/validateAnimationTimeUsage.js';

export function testValidateAnimationTimeUsage(logger) {
	const cases = [
		{'code': '', 'error': false, 'warn': false},
		{'code': 'fd 100', 'error': false, 'warn': false},
		{'code': 'print animation.time', 'error': false, 'warn': false},
		{'code': 'fd animation.time', 'error': false, 'warn': false},
		{'code': 'to animation.setup\nlocalmake "result createPList\nsetProperty "duration animation.time\noutput "result\nend',
			'error': false, 'warn': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateAnimationTimeUsage);
	});
};