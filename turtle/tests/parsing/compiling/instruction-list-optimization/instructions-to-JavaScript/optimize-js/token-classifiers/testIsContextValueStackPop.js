import { isContextValueStackPop } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextValueStackPop.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextValueStackPop(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'valueStack.pop()', 'numResults': 0},
	{'code': 'valueStack.length--', 'numResults': 0},
	{'code': 'context.pop()', 'numResults': 0},
	{'code': 'context.valueStack.pop()', 'numResults': 1},
	];
	processTokenCheckTests(cases, isContextValueStackPop, logger);
};