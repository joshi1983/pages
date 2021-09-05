import { validateUndeclaredVariableRead } from '../../../../modules/parsing/parse-tree-analysis/validation/validateUndeclaredVariableRead.js';
import { processValidationTestCase } from './processValidationTestCase.js';

export function testValidateUndeclaredVariableRead(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print :x', 'error': true},
		{'code': 'make "x 1', 'error': false},
		{'code': 'for ["x 1 5 1] [print :x]', 'error': false},
		{'code': 'for ["x 1 5 1] [print :X]', 'error': false}, // x is X because case insensitive.
		{'code': 'for ["x 1 5 1] [print :y]', 'error': true},
		{'code': 'make "x 1\nprint :x', 'error': false},
		{'code': 'to hello :x\nprint :x\nend', 'error': false},
		{'code': 'to hello :x\nprint :y\nend', 'error': true},
		{'code': 'make "y 1\nto hello :x\nprint :y\nend', 'error': false},
		{'code': 'to hello :x\nprint :y\nend\nmake "y 1', 'error': false},
		{'code': 'to hello :x\nlocalmake "y 1\nprint :y\nend', 'error': false},
		{'code': 'to hello :x\nfor ["y 1 5 1] [print :x]\nend', 'error': false},
		{'code': 'to hello :x\nfor ["y 1 5 1] [print :y]\nend', 'error': false},
		{'code': 'to p\nprint :x\nlocalmake "x 1\nprint :x\nend', 'error': true},
		{'code': 'to p\nlocalmake "x :x + 1\nprint :x\nend', 'error': true},
		{'code': 'to p\nmake "x :X + 15\nprint :x\nend', 'error': true},
		{'code': 'to p\nmake "x 5\nEnd\nto p2\np\neNd\nprint :X', 'error': true},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\np\nprint :x', 'error': false},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\np2\nprint :x', 'error': false},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\nto p3\np2\nend\nprint :x', 'error': true},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\nto p3\np2\nend\np3\nprint :x', 'error': false},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\nto p3\np2\nend\np2\nprint :x', 'error': false},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\nto p3\np2\nend\np\nprint :x', 'error': false},
		{'code': 'make "x 1\nmake "x :x + 1', 'error': false},
		{'code': 'make "x :x + 1', 'error': true},
		{'code': 'to p\nmake "x :x + 1\nend', 'error': true},
		{'code': 'to p\nmake "x 5\nrepeat 2[\nMake "x :x + 1\n]\nend', 'error': false},
		{'code': 'to p\nprint :x\nmake "x 5\nend', 'error': true},
		{'code': 'to p\nrepeat 2[\nmake "x :x + 1\n]\nend', 'error': true},
		{'code': 'to p\nlocalmake "x :x + 1\nend', 'error': true},
		{'code': 'to p\nlocalmake "x 5\nrepeat 2 [\nlocalmake "x :x + 1\n]\nend', 'error': false},
		{'code': 'to p\nrepeat 2 [\nlocalmake "x :x + 1\n]\nend', 'error': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateUndeclaredVariableRead);
	});
}