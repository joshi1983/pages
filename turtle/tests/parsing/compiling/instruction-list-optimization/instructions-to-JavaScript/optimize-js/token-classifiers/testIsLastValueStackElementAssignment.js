import { isLastValueStackElementAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isLastValueStackElementAssignment.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsLastValueStackElementAssignment(logger) {
	const cases = [
	{'code': 'context.valueStack[context.valueStack.length - 1]', 'numResults': 0},
	{'code': 'valueStack[valueStack.length - 1]', 'numResults': 0},
	{'code': 'context.valueStack[context.valueStack.length - 1] = 4', 'numResults': 1},
	{'code': 'valueStack[valueStack.length - 1] = 4', 'numResults': 1},
	{'code': 'context.valueStack[context.valueStack.length - 1] += 3', 'numResults': 1},
	{'code': 'context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1]', 'numResults': 1}
	];
	processTokenCheckTests(cases, isLastValueStackElementAssignment, logger);
};