import { processValidationTestCase } from './processValidationTestCase.js';
import { validateForLoops } from '../../../../modules/parsing/parse-tree-analysis/validation/validateForLoops.js';

export function testValidateForLoops(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'for ["x 1 5 1] [print :x]', 'error': false},
		{'code': 'for ["x 1 2+3 1] [print :x]', 'error': false},
		{'code': 'for ["x 1 2*3 1] [print :x]', 'error': false},
		{'code': 'for ["x 1 5 1 1] [print :x]', 'error': true}, // too many control parameters
		{'code': 'for ["x 1 5] [print :x]', 'error': false}, // this is fine.  The step value will be 1.
		{'code': 'for ["x 1] [print :x]', 'error': true}, // too few...
		{'code': 'for ["x] [print :x]', 'error': true}, // too few...
		{'code': 'for [] [fd 10]', 'error': true}, // too few...
		{'code': 'for [x 1 5 1] [print :x]', 'error': true}, // " required on variable name
		{'code': 'for [[] 1 5 1] [print :x]', 'error': true}, // variable name must be a string.
		{'code': 'for [() 1 5 1] [print :x]', 'error': true},
		{'code': 'for [] [print 4]', 'error': true}, // too few parameters
		{'code': 'for () [print 4]', 'error': true},
		{'code': 'for "x [print 4]', 'error': true},
		{'code': 'for [print 4]', 'parseFail': true, 'error': true},
		{'code': 'for', 'parseFail': true, 'error': true},
		{'code': 'to hello\nfor ["x 1 5 1] [print :x]\nend', 'error': false},
		{'code': 'to hello\nfor [x 1 5 1] [print :x]\nend', 'error': true},
		{'code': 'for ["x z 5 1] [print :x]', 'error': true},
		{'code': 'for ["x 1 z 1] [print :x]', 'error': true},
		{'code': 'for ["x 1 5 z] [print :x]', 'error': true},
		{'code': 'for ["x "z 5 1] [print :x]', 'error': true},
		{'code': 'for ["x 1 "z 1] [print :x]', 'error': true},
		{'code': 'for ["x 1 5 "z] [print :x]', 'error': true},
		{'code': 'for ["x 1 5 1 1] [print :x]', 'error': true},
		{'code': 'for ["x 1 5 1] [for ["y 1 5 1] [print :x print :y]]', 'error': false},
		{'code': 'for ["x 1 5 1] [for ["x 1 5 1] [print :x]]', 'error': true},
	];

	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateForLoops);
	});
};