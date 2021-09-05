import { isStringToken } from
'../../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/variable-data-types/isStringToken.js';
import { processTokenTestCases } from
'./processTokenTestCases.js';

export function testIsStringToken(logger) {
	const cases = [
		{'code': '"hello"', 'count': 1},
		{'code': 'print', 'count': 0},
		{'code': 'print 2', 'count': 0},
		{'code': 'print "hello";4,3', 'count': 1},
		{'code': 'print space$ 1', 'count': 1},
		{'code': 'print space$ 3', 'count': 1},
		{'code': 'defstr x\nprint x', 'count': 1},
		{'code': 'DEFSTR x\nprint x', 'count': 1},
		{'code': 'defint x\nprint x', 'count': 0},
		{'code': 'defdbl x\nprint x', 'count': 0},
		{'code': 'defsng x\nprint x', 'count': 0},
		{'code': 'dim x\nprint x', 'count': 0},
		{'code': 'dim x,y\nprint x\nprint y', 'count': 0},
		{'code': 'dim x,y,z\nprint x\nprint y\nprint z', 'count': 0},
		{'code': 'dim x as string\nprint x', 'count': 1},
		{'code': 'DIM x as string\nprint x', 'count': 1},
		{'code': 'dim x as someCustomType\nprint x', 'count': 0},
		{'code': 'dim x as integer\nprint x', 'count': 0},
	];
	processTokenTestCases(cases, isStringToken, logger);
};