import { processValidationTestCase } from './processValidationTestCase.js';
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
		{'code': 'polystart\nfd 100\npolyend', 'warn': false, 'error': true}, // not enough to fill a path so error.
		{'code': 'polystart\nfd 100\nright 90\nfd 200\npolyend', 'warn': false, 'error': false}, // enough to fill a triangle so no error
		{'code': 'polystart\ncircle 100\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nellipse 100 200\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nhome\nellipse 100 200\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\nfd 100\nright 90\nfd 100\npolyend\npolyend', 'warn': false, 'error': true},
		{'code': 'polystart\npolystart\n repeat 4 [fd 100 right 90]\npolyend\n', 'warn': true, 'error': false},
		{'code': 'to p1\npolystart\nrepeat 4 [fd 100 right 90]\npolyend\nend\npolystart\n repeat 4 [fd 100 right 90]\npolyend\n', 'warn': false, 'error': false},
		{'code': 'polyStart\nforward 100\njumpRight 100\nback 100\npolyEnd', 'warn': false, 'error': false},
		{'code': 'polyStart\nforward 100\njumpRight 100\npolyEnd', 'warn': false, 'error': false},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validatePolyCommandUsage);
	});
};