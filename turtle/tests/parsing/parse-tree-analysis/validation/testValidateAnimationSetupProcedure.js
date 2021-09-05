import { processValidationTestCase } from './processValidationTestCase.js';
import { validateAnimationSetupProcedure } from '../../../../modules/parsing/parse-tree-analysis/validation/validateAnimationSetupProcedure.js';

export function testValidateAnimationSetupProcedure(logger) {
	const cases = [
		{'code': '', 'error': false, 'warn': false},
		{'code': 'to p\nend', 'error': false, 'warn': false},
		{'code': 'to animation.setup\noutput 5\nend\n', 'error': false, 'warn': false},
		{'code': 'to animation.setup :something\noutput 5\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.setup\nend\n', 'error': true, 'warn': false},
		{'code': 'to animation.setup\nreturn animation.time\nend\n', 'error': true, 'warn': false},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateAnimationSetupProcedure);
	});
};