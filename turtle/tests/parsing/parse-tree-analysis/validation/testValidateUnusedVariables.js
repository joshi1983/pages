import { processValidationTestCase } from './processValidationTestCase.js';
import { validateUnusedVariables } from '../../../../modules/parsing/parse-tree-analysis/validation/validateUnusedVariables.js';

export function testValidateUnusedVariables(logger) {
	const cases = [
		{'code': '', 'error': false, 'warn': false},
		{'code': 'make "x 5', 'error': false, 'warn': false},
		{'code': 'make "x 5 make "y 10', 'error': false, 'warn': false},
		{'code': 'make "x 5 Make "X 10', 'error': false, 'warn': true},
		{'code': 'make "x 5 to p\nlocalmake "x 10\nend', 'error': false, 'warn': true},
		{'code': 'make "x 5 to p\nlocalmake "x 10 print :x\nend', 'error': false, 'warn': false},
		{'code': 'to p :x\nend', 'error': false, 'warn': true},
		{'code': 'to p :x\nprint :x\nend', 'error': false, 'warn': false},
		{'code': 'to p :x\nsetProperty "x 0 5\nend', 'error': false, 'warn': false},
		{'code': 'to p :x\nprint getProperty "x 0\nend', 'error': false, 'warn': false},
		{'code': 'to p :x\nqueue "x 5\nend', 'error': false, 'warn': false},
		{'code': `make "colorStops plistCreate
setProperty "colorStops 0 "black
make "gradient createLinearGradient [0 0] [0 100] :colorStops "pad`, 'error': false, 'warn': false},
		{'code': 'to p\nlocalmake "p plistCreate\nsetProperty "p 0 1\nend', 'error': false, 'warn': true},
		{'code': 'to p\nlocalmake "p []\nqueue "p 1\nend', 'error': false, 'warn': true},
		{'code': 'to p\nlocalmake "p []\nqueue "p 1\nprint :p\nend', 'error': false, 'warn': false},
		{'code': 'to p :s\nfd :s\nend\nto q :s\nfd :s\nEnd', 'error': false, 'warn': false},
		{'code': 'to star :x\nrepeat 2 [\nforward :x\n]\nend\nto moon :x\nback :x\nend', 'error': false, 'warn': false},
		{'code': 'to f\nend\nf', 'warn': false, 'error': false}, // no variables so nothing to warn about.
		{'code': 'to f\nlocalmake "x 3\nend\n', 'warn': true, 'error': false}, // x is unused so warn.
		{'code': 'to f\nlocalmake "x 3\nprint :x\nend\n', 'warn': false, 'error': false}, // x is used so no problem.
		{'code': 'to g\nend\nto f\nlocalmake "x 3\nprint :x\nend\n', 'warn': false, 'error': false},
		// x is used in the procedure it is declared in so no need to complain about g not using it.
		{'code': 'to f :x\nlocalmake "x 3\nend\n', 'warn': true, 'error': false},
		{'code': 'to hello\nprint 1\nend', 'error': false, 'warn': false},
		{'code': 'to hello :x\nprint :x\nend', 'error': false, 'warn': false},
		{'code': 'to hello :x\nprint 1\nend', 'error': false, 'warn': true},
		{'code': 'to hello :x\nrepeat 5 [print :x]\nend', 'error': false, 'warn': false},

		{'code': 'to hello :x\nfor ["x 1 5 1] [print :x]\nend', 'error': false, 'warn': true},
		// reading :x in the for-loop doesn't count because it still ignores the original value of the :x parameter.
		{'code': 'to f :x\nsetProperty "x 0 3\nend\n', 'warn': false, 'error': false},
		// setProperty uses parameter x by mutating it.
		{'code': 'to f :x\nsetProperty "y 0 3\nend\nmake "y plistCreate\n', 'warn': true, 'error': false},
		// setProperty mutates global variable y but not the x parameter so x is unused.
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateUnusedVariables);
	});
};