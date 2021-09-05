import { validatePenUp } from '../../../../modules/parsing/parse-tree-analysis/validation/validatePenUp.js';
import { processValidationTestCases } from './processValidationTestCases.js';

function testVariousCases(logger) {
	const cases = [
		{'code': '', 'warn': false},
		{'code': 'penUp forward 1', 'warn': false},
		{'code': 'penUp circle 1', 'warn': false},
		{'code': 'penUp setX 1', 'warn': false},
		{'code': 'penUp setY 1', 'warn': false},
		{'code': 'penUp setZ 1', 'warn': false},
		{'code': 'penUp setXY 1 2', 'warn': false},
		{'code': 'penUp setXYZ 1 2 3', 'warn': false},
		{'code': 'penUp setPos [1 2]', 'warn': false},
		{'code': 'penUp ellipse 1 2', 'warn': false},
		{'code': 'penUp ellipse2 1 2', 'warn': false},
		{'code': 'penUp ellipseArc 1 2 3 4', 'warn': false},
		{'code': 'penUp if 2 < random 5 [forward 1]', 'warn': false},
		{'code': 'if 2 < random 5 [penUp] forward 1', 'warn': false},
		{'code': 'penUp arcRight 1 1', 'warn': false},
		{'code': 'penUp arcLeft 1 1', 'warn': false},
		{'code': 'penUp arc 1 1', 'warn': false},
		{'code': 'penUp arc2 1 1', 'warn': false},
		{'code': 'repeat 2 [forward 1 penUp]', 'warn': false},
		// the penUp could affect the forward 1 in second iteration of repeat-loop so don't warn.
		{'code': 'repeat 2 [forward 1 penUp] penDown forward 2', 'warn': false},
		// the penUp could affect the forward 1 in second iteration of repeat-loop so don't warn.
		{'code': 'penNormal', 'warn': false},
		// don't warn about penNormal since it does more than put the pen down.
		{'code': 'penUp ifelse 2 < random 5 [forward 1] [fd 5]', 'warn': false},
		{'code': 'to p\npenUp\nend\nto p2\npenDown forward 3\nend\np\narcRight 90 2\np2', 'warn': false},
		{'code': 'to p\npenDown\nrepeat 4 [\nforward :sideLength\nright 90\n]\npenUp\nend', 'warn': false},

		{'code': 'p\nforward 1\nto p\npenUp\nend', 'warn': false},
		{'code': 'p\nbackward 5\npenDown\nto p\npenUp\nend\nforward 3', 'warn': false},
		{'code': 'penUp', 'warn': true},
		{'code': 'penUp penDown forward 1', 'warn': true},
		{'code': 'penUp\njumpForward 1\npenDown', 'warn': true},
		{'code': 'penUp\nsetHeading :oldHeading\njumpTo :oldPos\npenDown', 'warn': true},
	];
	cases.forEach(caseInfo => caseInfo.error = false); // never expect error.  only warnings.
	processValidationTestCases(cases, logger, validatePenUp);
}

export function testValidatePenUp(logger) {
	testVariousCases
};