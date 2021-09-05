import { processValidationTestCases } from './processValidationTestCases.js';
import { validateCreatePList2 } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateCreatePList2.js';

export function testValidateCreatePList2(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'make "x createPList2 []', 'error': false},
		{'code': 'make "x createPList2 [["x 1]]', 'error': false},
		{'code': 'make "x createPList2 [["x 1] ["y 5]]', 'error': false},
		{'code': 'make "x createPList2 [["x 1] ["x 5]]', 'error': false, 'warn': true},
		{'code': 'make "pair ["x 4] make "x createPList2 [["x 1] :pair]', 'error': false, 'warn': true},
		{'code': 'make "key "x make "x createPList2 [["x 1] [:key 3]]', 'error': false, 'warn': true},
		{'code': 'make "x createPList2 [[1 3]]', 'error': false},
		{'code': 'make "x createPList2 [[true 3]]', 'error': false},
		{'code': 'make "x createPList2 [[true 3 4]]', 'error': true},
		{'code': 'make "x createPList2 [[true]]', 'error': true},
		{'code': 'make "x createPList2 [[]]', 'error': true},
		{'code': 'make "x createPList2 [[:x :y]]', 'error': false},
		{'code': 'make "x createPList2 [[:x]]', 'error': true},
		{'code': 'make "x createPList2 [:x]', 'error': false},
		{'code': 'make "x createPList2 [["x :x :y]]', 'error': true},
	];
	processValidationTestCases(cases, logger, validateCreatePList2);
};