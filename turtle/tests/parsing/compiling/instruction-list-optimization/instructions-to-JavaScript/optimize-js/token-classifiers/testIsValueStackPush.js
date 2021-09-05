import { isValueStackPush } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isValueStackPush.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsValueStackPush(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': `context.readVariable("x")`, 'numResults': 0},
	{'code': `context.valueStack.pop()`, 'numResults': 0},
	{'code': `if (context.valueStack.pop()) {}`, 'numResults': 0},
	{'code': `context.valueStack.push("x")`, 'numResults': 1},
	{'code': `context.valueStack.push(true);
if (context.valueStack.pop()) {}`, 'numResults': 1},
	];
	processTokenCheckTests(cases, isValueStackPush, logger);
};