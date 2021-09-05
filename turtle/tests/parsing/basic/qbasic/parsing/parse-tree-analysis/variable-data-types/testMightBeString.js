import { mightBeString } from
'../../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/variable-data-types/mightBeString.js';
import { processTokenTestCases } from
'./processTokenTestCases.js';

export function testMightBeString(logger) {
	const cases = [
	{'code': '"hello"', 'count': 1},
	{'code': 'print', 'count': 0},
	{'code': 'print 2', 'count': 0},
	{'code': 'print "hello";4,3', 'count': 1}
	];
	processTokenTestCases(cases, mightBeString, logger);
};