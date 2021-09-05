import { isNoContextValueStackPop } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isNoContextValueStackPop.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsNoContextValueStackPop(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'valueStack.pop()', 'numResults': 1},
	{'code': 'valueStack.length--', 'numResults': 0},
	{'code': 'context.pop()', 'numResults': 0},
	{'code': 'context.valueStack.pop()', 'numResults': 0},
	];
	processTokenCheckTests(cases, isNoContextValueStackPop, logger);
};