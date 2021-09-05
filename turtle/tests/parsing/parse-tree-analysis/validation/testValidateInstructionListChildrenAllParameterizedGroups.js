import { processValidationTestCase } from './processValidationTestCase.js';
import { validateInstructionListChildrenAllParameterizedGroups } from '../../../../modules/parsing/parse-tree-analysis/validation/validateInstructionListChildrenAllParameterizedGroups.js';

export function testValidateInstructionListChildrenAllParameterizedGroups(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'for ["x 1 5 1] [print :x]', 'error': false},
		{'code': 'fd 100', 'error': false},
		{'code': 'fd 100 + 50', 'error': false},
		{'code': 'to p\nfd 100\nend', 'error': false},
		{'code': 'to p :len\nfd :len\nend', 'error': false},

		{'code': '5+7', 'error': true},
		{'code': 'make "x 4\n:x', 'error': true},
		{'code': 'make "x 45\n -:x', 'error': true},
		{'code': '5+7', 'error': true},
		{'code': '[]', 'error': true},
		{'code': '(sum 3 4 5)', 'error': true},
		{'code': 'to p\nfd 100\n4 * 5\nend', 'error': true},
		{'code': 'to p\nifelse 1 < 2 [\nfd 100\n] [\n4 * 5]\nend', 'error': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateInstructionListChildrenAllParameterizedGroups);
	});
};