import { isPropertyToken } from
'../../../../../../modules/parsing/processing/parsing/parse-tree-analysis/variable-data-types/isPropertyToken.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { processTokenCheckTests } from
'../../../../compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/processTokenCheckTests.js';

export function testIsPropertyToken(logger) {
	const cases = [
	{'code': 'PI', 'numResults': 0},
	{'code': 'x()', 'numResults': 0},
	{'code': 'x', 'numResults': 0},
	{'code': 'x.length', 'numResults': 1},
	{'code': 'x.length.bla', 'numResults': 2},
	{'code': 'x.length.bla()', 'numResults': 2},
	{'code': 'this.y', 'numResults': 1},
	];
	processTokenCheckTests(cases, isPropertyToken, logger, parse);
};