import { polyFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/polyFixer.js';
import { processTestCases } from './processTestCases.js';

export function testPolyFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'polyEnd', 'logged': false},
		{'code': 'polyStart', 'logged': false},
		{'code': 'polyStart polyEnd', 'to': ' ', 'logged': true},
		{'code': 'polyStart circle 100 polyEnd', 'to': ' circle 100 ', 'logged': true},
		{'code': 'polyStart circleRight 100 polyEnd', 'to': ' circleRight 100 ', 'logged': true},
		{'code': 'polyStart circleLeft 100 polyEnd', 'to': ' circleLeft 100 ', 'logged': true},
		{'code': 'polyStart CIRCLELEFT 100 polyEnd', 'to': ' CIRCLELEFT 100 ', 'logged': true},
		{'code': 'polyStart setColors "orange circleRight 100 polyEnd',
			'to': ' setColors "orange circleRight 100 ',
			'logged': true
		},
		{'code': 'to p\npolyStart circleLeft 10\npolyEnd\nend\n',
			'to': 'to p\n circleLeft 10\n\nend\n',
			'logged': true
		},
		{'code': 'to p\npolyStart circleLeft 10\npolyEnd\nend\np',
			'to': 'to p\n circleLeft 10\n\nend\np',
			'logged': true
		},
		{'code': 'to p1\npolyEnd\nend\nto p2\npolyStart circleLeft 20\np1\npolyEnd\nend',
			// not fixing p2 because it calls p1 which calls a path-related command.
			'logged': false
		},
		{'code': 'to p1\npolyEnd\nend\nto p2\np1\nend\nto p3\npolyStart circleLeft 20\np2\npolyEnd\nend',
			// not fixing p2 because it calls p2 which calls p1 which contains a path-related command.
			// indirect calling to test a transitive closure in getPolyUnsafeProcedures.js.
			'logged': false
		},
		{'code': 'to p\npolyEnd\npolyStart\n fd 100\nright 90\nfd 100\noutput 100\nend\npolyStart circleLeft p\npolyEnd',
			'logged': false
		},// procedure p ends the path so the fixer shouldn't do anything with the global polyStart and polyEnd 
		{'code': 'to p\noutput 10\nend\npolyStart\ncircle p\npolyEnd',
		'to': 'to p\noutput 10\nend\n\ncircle p\n',
		'logged': true
		}// since procedure p never does any path-related changes, 
		// removing polyStart and polyEnd is definitely an improvement and definitely fixes something.
	];
	processTestCases(cases, polyFixer, logger);
};