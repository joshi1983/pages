import { processValidationTestCases } from './processValidationTestCases.js';
import { validatePolyCommandUsage } from '../../../../modules/parsing/parse-tree-analysis/validation/validatePolyCommandUsage.js';

export function testValidatePolyCommandUsage(logger) {
	const cases = [
		{'code': '', 'warn': false, 'error': false},
		{'code': 'polystart repeat 4 [fd 100 right 90] polyend', 'warn': false, 'error': false},
		{'code': 'polystart repeat 4 [arc2 90 100] polyend', 'warn': false, 'error': false},
		{'code': 'polystart\nfd 100\nright 90\nfd 100\npolyend', 'warn': false, 'error': false},
		{'code': 'polystart', 'warn': true, 'error': false},
		{'code': 'polyend', 'warn': false, 'error': true},
		{'code': 'polystart\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nprint "hi\npolyend', 'warn': false, 'error': true},

		// also not enough to fill a path
		{'code': 'polystart\nfd 100\npolyend', 'warn': false, 'error': true}, // not enough to fill a path so error.
		{'code': 'polystart\nsetPos [100 100]\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\njumpForward 100\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\njumpRight 100\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\njumpLeft 100\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\njumpIn 100\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\njumpOut 100\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nforward 100\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nbackward 100\npolyend', 'warn': false, 'error': true},

		{'code': 'jumpTo [0 0]\npolystart\nsetPos [100 100]\nsetPos [0 100]\npolyend', 'warn': false, 'error': false},
		// enough to make a triangle so no problem.

		{'code': 'polystart\nfd 100\nright 90\nfd 200\npolyend', 'warn': false, 'error': false}, // enough to fill a triangle so no error
		{'code': 'polystart\ncircle 100\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nellipse 100 200\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nhome\nellipse 100 200\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nfd 100\nright 90\nfd 100\npolyend\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\npolystart\n repeat 4 [fd 100 right 90]\npolyend\n', 'warn': true, 'error': false},
		{'code': 'to p1\npolystart\nrepeat 4 [fd 100 right 90]\npolyend\nend\npolystart\n repeat 4 [fd 100 right 90]\npolyend\n', 'warn': false, 'error': false},
		{'code': 'polyStart\nforward 100\njumpRight 100\nback 100\npolyEnd', 'warn': false, 'error': false},
		{'code': 'polyStart\nforward 100\njumpRight 100\npolyEnd', 'warn': false, 'error': false},
		{'code': 'to p\nrepeat 3 [\njumpForward 10\nright 90\n]\nend\npolystart\np\npolyend', 'warn': false, 'error': false},
		// no error or warning expected since p adds the shapes for the path.
		{'code': 'to p\npolyEnd\nend\npolystart\np\npolyend', 'warn': false, 'error': true},
		{'code': 'to p\npolyStart\narcRight 90 100\nend\npolystart\np\npolyend', 'warn': true, 'error': false},
		{'code': `to p :points :colorChangeIndex
	localmake "changed? false
	polyStart
	for ["index 2 count :points] [
		if and (not :changed?) :colorChangeIndex <= :index [
			if :colorChangeIndex > 20 [
				polyEnd
			]
			localmake "changed? true
		]
		localmake "p item :index :points
		setHeading towards :p
		ifelse :index = 2 [
			jumpForward distance :p
		] [
			forward distance :p
		]
	]
	if and (count :points) > 2 (count :points) <= 20 [
		polyEnd
	]
end`, 'warn': false, 'error': false},
/*
The second polyEnd is called only if the first polyEnd wasn't.
*/
	];
	processValidationTestCases(cases, logger, validatePolyCommandUsage);
};