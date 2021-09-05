import { processValidationTestCases } from './processValidationTestCases.js';
import { validateInstructionListChildrenAllParameterizedGroups } from '../../../../modules/parsing/parse-tree-analysis/validation/validateInstructionListChildrenAllParameterizedGroups.js';

export function testValidateInstructionListChildrenAllParameterizedGroups(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'for ["x 1 5 1] [print :x]', 'error': false},
		{'code': 'if randomRatio < 0.5 [print :x]', 'error': false},
		{'code': 'ifelse randomRatio < 0.5 [print :x] []', 'error': false},
		{'code': 'repeat 2 [print repcount]', 'error': false},
		{'code': 'print penColor', 'error': false},
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
		{'code': '(print 3 4 5)', 'error': false},
		{'code': 'penColor', 'error': true},
		{'code': 'repeat 2 [repcount]', 'error': true},
		{'code': 'to p\nfd 100\n4 * 5\nend', 'error': true},
		{'code': 'to p\nifelse 1 < 2 [\nfd 100\n] [\n4 * 5]\nend', 'error': true},
		{'code': 'to p :x\nfd :x\nright 90\nend\n(invoke "p)', 'error': false},
		// invoke within curved brackets should be acceptable as a direct child of an instruction list.
		{'code': 'print "hi - 4', 'error': true} // the '-' should be unary here so it would not be grouped under the print.
	];
	processValidationTestCases(cases, logger, validateInstructionListChildrenAllParameterizedGroups);
};