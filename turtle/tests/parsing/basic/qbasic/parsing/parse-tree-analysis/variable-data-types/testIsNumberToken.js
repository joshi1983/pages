import { isNumberToken } from
'../../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/variable-data-types/isNumberToken.js';
import { processTokenTestCases } from
'./processTokenTestCases.js';

export function testIsNumberToken(logger) {
	const cases = [
		{'code': '"hello"', 'count': 0},
		{'code': 'print', 'count': 0},
		{'code': 'print 2', 'count': 1},
		{'code': 'print "hello";4,3', 'count': 2},
		{'code': `for i = 0 to 3
	print i
next i`, 'count': 3},
		{'code': 'dim x as string\nprint x', 'count': 0},
		{'code': 'dim x as someCustomType\nprint x', 'count': 0},
		{'code': 'dim x as integer\nprint x', 'count': 1},
		{'code': 'dim x as long\nprint x', 'count': 1},
		{'code': 'dim x as _unsigned _byte\nprint x', 'count': 1},
		{'code': 'dim x as _unsigned _integer64\nprint x', 'count': 1},
		{'code': 'dim x as _unsigned integer\nprint x', 'count': 1},
		{'code': 'dim x as _unsigned long\nprint x', 'count': 1},
		{'code': 'dim x as _bit\nprint x', 'count': 1},
		{'code': 'dim x as _byte\nprint x', 'count': 1},
		{'code': 'dim x as _integer64\nprint x', 'count': 1},
		{'code': 'dim x as _float\nprint x', 'count': 1},
		{'code': 'dim x as double\nprint x', 'count': 1},
		{'code': 'dim x as single\nprint x', 'count': 1},
		{'code': 'defint x\nprint x', 'count': 1},
		{'code': 'defint x\nprint x', 'count': 1},
		{'code': 'defstr x\nprint x', 'count': 0}, // a string is not a number.
		{'code': 'defsng x\nprint x', 'count': 1},
		{'code': 'defdbl x\nprint x', 'count': 1},
		{'code': 'defint a-z\nprint a\nprint b\nprint c', 'count': 3},
		{'code': 'defstr a-z\nprint x', 'count': 0},
		{'code': 'defint a-c\nprint x', 'count': 0},
	];
	processTokenTestCases(cases, isNumberToken, logger);
};