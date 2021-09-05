import { isLastValueStackElementExpression } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isLastValueStackElementExpression.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsLastValueStackElementExpression(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'valueStack.length - 1', 'numResults': 0},
	{'code': '[valueStack.length - 1]', 'numResults': 0},
	{'code': 'const x = [valueStack.length - 1]', 'numResults': 0},
	{'code': 'x[valueStack.length - 1]', 'numResults': 0},
	{'code': 'valueStack[valueStack.length - 1]', 'numResults': 1},
	{'code': 'context.valueStack[valueStack.length - 1]', 'numResults': 1},
	{'code': 'context.valueStack[context.valueStack.length - 1]', 'numResults': 1},
	];
	processTokenCheckTests(cases, isLastValueStackElementExpression, logger);
};