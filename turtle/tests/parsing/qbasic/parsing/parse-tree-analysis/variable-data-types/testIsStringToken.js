import { isStringToken } from
'../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/isStringToken.js';
import { processTokenTestCases } from
'./processTokenTestCases.js';

export function testIsStringToken(logger) {
	const cases = [
	{'code': '"hello"', 'count': 1},
	{'code': 'print', 'count': 0},
	{'code': 'print 2', 'count': 0},
	{'code': 'print "hello";4,3', 'count': 1}
	];
	processTokenTestCases(cases, isStringToken, logger);
};