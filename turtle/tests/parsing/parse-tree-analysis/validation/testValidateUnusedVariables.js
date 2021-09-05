import { processValidationTestCase } from './processValidationTestCase.js';
import { validateUnusedVariables } from '../../../../modules/parsing/parse-tree-analysis/validation/validateUnusedVariables.js';

export function testValidateUnusedVariables(logger) {
	const cases = [
		{'code': '', 'warn': false},
		{'code': 'make "x 5', 'warn': false},
		{'code': 'make "x 6\nprint :x', 'warn': false},
		{'code': 'make "x 5 make "y 10', 'warn': false},
		{'code': 'make "x 5 Make "X 10', 'warn': true},
		{'code': `makE "x 5
make "x :x + 6
print :x`, 'warn': false},
		{'code': 'make "x 5 to p\nlocalmake "x 10\nend', 'warn': true},
		{'code': 'make "x 5 to p\nlocalmake "x 10 print :x\nend', 'warn': false},
		{'code': 'to p :x\nend', 'warn': true},
		{'code': 'to p :x\nprint :x\nend', 'warn': false},
		{'code': 'to p :x\nsetProperty "x 0 5\nend', 'warn': false},
		{'code': 'to p :x\nprint getProperty "x 0\nend', 'warn': false},
		{'code': 'to p :x\nqueue "x 5\nend', 'warn': false},
		{'code': `make "colorStops createPList
setProperty "colorStops 0 "black
make "gradient createLinearGradient [0 0] [0 100] :colorStops "pad`, 'warn': false},
		{'code': 'to p\nlocalmake "p createPList\nsetProperty "p 0 1\nend', 'warn': true},
		{'code': 'to p\nlocalmake "p []\nqueue "p 1\nend', 'warn': true},
		{'code': 'to p\nlocalmake "p []\nqueue "p 1\nprint :p\nend', 'warn': false},
		{'code': 'to p :s\nfd :s\nend\nto q :s\nfd :s\nEnd', 'warn': false},
		{'code': 'to star :x\nrepeat 2 [\nforward :x\n]\nend\nto moon :x\nback :x\nend', 'warn': false},
		{'code': 'to f\nend\nf', 'warn': false}, // no variables so nothing to warn about.
		{'code': 'to f\nlocalmake "x 3\nend\n', 'warn': true}, // x is unused so warn.
		{'code': 'to f\nlocalmake "x 3\nprint :x\nend\n', 'warn': false}, // x is used so no problem.
		{'code': 'to g\nend\nto f\nlocalmake "x 3\nprint :x\nend\n', 'warn': false},
		// x is used in the procedure it is declared in so no need to complain about g not using it.
		{'code': 'to f :x\nlocalmake "x 3\nend\n', 'warn': true},
		{'code': 'to hello\nprint 1\nend', 'warn': false},
		{'code': 'to hello :x\nprint :x\nend', 'warn': false},
		{'code': 'to hello :x\nprint 1\nend', 'warn': true},
		{'code': 'to hello :x\nrepeat 5 [print :x]\nend', 'warn': false},

		{'code': 'to hello :x\nfor ["x 1 5 1] [print :x]\nend', 'warn': true},
		// reading :x in the for-loop doesn't count because it still ignores the original value of the :x parameter.
		{'code': 'to f :x\nsetProperty "x 0 3\nend\n', 'warn': false},
		// setProperty uses parameter x by mutating it.
		{'code': 'to f :x\nsetProperty "y 0 3\nend\nmake "y createPList\n', 'warn': true},
		// setProperty mutates global variable y but not the x parameter so x is unused.
		{'code': 'to f :x\nsetProperty "y 0 3\nend\nmake "y createPList\n', 'warn': true},
		// setProperty mutates global variable y but not the x parameter so x is unused.
		{'code': `to p :cells
	localmake "cell item 1 item 1 :cells
	setItem 3 "cell true
end`, 'warn': false},
		{'code': `to p :cells
	localmake "c :cells
	queue2 "c 3
end`, 'warn': false
		},
		// don't warn because the queue2 indirectly mutates cells which does something the caller will notice.
		// c is used here.
		{'code': `to p :cells
	localmake "c :cells
	queue "c 3
end`, 'warn': true},
// warn because cells won't be mutated so c is really unused here.
	
		{'code': `make "x 3
to p1
	make "x 6
	print :x
end
print :x`,
			'warn': false
// The 3 would be printed with that code proving that the value of x is used.
// The 6 would be printed if p1 is ever called.  Procedures might be called from Commander.
		},
		{'code': 'for [ "i 100 10 -10 ] []\nmake "i 0', 'warn': true},
		{'code': `makE "x 5
make "x 6
print :x`, 'warn': true}
		/* The value of 5 is never read from variable x.  */
	];
	cases.forEach(caseInfo => caseInfo.error = false);
	// the validator should never add an error message.  Only warnings.

	cases.forEach(function(caseInfo, index) {
		if (typeof caseInfo.warn !== 'boolean')
			logger(`Expected a boolean value for warn at case index ${index} but got ${caseInfo.warn}`);
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateUnusedVariables);
	});
};