import { isArrayToken } from
'../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/isArrayToken.js';
import { processTokenTestCases } from
'./processTokenTestCases.js';

export function testIsArrayToken(logger) {
	const cases = [
	{'code': '"hello"', 'count': 0},
	{'code': 'print', 'count': 0},
	{'code': 'print 2', 'count': 0},
	{'code': 'print "hello";4,3', 'count': 0},
	{'code': `DIM a`, 'count': 0},
	{'code': `DIM a
print a`, 'count': 1},
	{'code': `DIM a
print a(1)`, 'count': 1},
	];
	processTokenTestCases(cases, isArrayToken, logger);
};