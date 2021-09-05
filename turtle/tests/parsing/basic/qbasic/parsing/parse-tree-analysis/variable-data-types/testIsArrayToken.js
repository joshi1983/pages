import { isArrayToken } from
'../../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/variable-data-types/isArrayToken.js';
import { processTokenTestCases } from
'./processTokenTestCases.js';

export function testIsArrayToken(logger) {
	const cases = [
	{'code': '"hello"', 'count': 0},
	{'code': 'print', 'count': 0},
	{'code': 'print 2', 'count': 0},
	{'code': 'print "hello";4,3', 'count': 0},
	{'code': `DIM a`, 'count': 0},
	{'code': `DIM a(4)`, 'count': 0},
	// a is an array but no token in the code is reading from a.

	{'code': `DIM a
print a`, 'count': 0},
	{'code': `DIM a as String
print a`, 'count': 0},
	{'code': `DIM a(3)
print a`, 'count': 1},
	{'code': `DIM SHARED a(3)
print a`, 'count': 1},
	{'code': `DIM a(1 to 3)
print a`, 'count': 1}, // 1D array with valid indexes 1,2,3.
	{'code': `DIM SHARED a(1 to 3)
print a`, 'count': 1}, // a shared array is still an array.

	{'code': `DIM a(3, 5)
print a`, 'count': 1}, // 2D array
	{'code': `DIM SHARED a(3, 5)
print a`, 'count': 1},

	{'code': `DIM a(1 to 5)
print a(1)`, 'count': 1},
	{'code': `DIM SHARED a(1 to 5)
print a(1)`, 'count': 1},
	];
	processTokenTestCases(cases, isArrayToken, logger);
};