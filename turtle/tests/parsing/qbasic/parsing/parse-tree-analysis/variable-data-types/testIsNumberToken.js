import { isNumberToken } from
'../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/isNumberToken.js';
import { processTokenTestCases } from
'./processTokenTestCases.js';

export function testIsNumberToken(logger) {
	const cases = [
	{'code': '"hello"', 'count': 0},
	{'code': 'print', 'count': 0},
	{'code': 'print 2', 'count': 1},
	{'code': 'print "hello";4,3', 'count': 2}
	];
	processTokenTestCases(cases, isNumberToken, logger);
};