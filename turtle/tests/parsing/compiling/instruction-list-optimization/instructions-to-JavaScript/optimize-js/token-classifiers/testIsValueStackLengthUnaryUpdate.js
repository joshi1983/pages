import { isValueStackLengthUnaryUpdate } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isValueStackLengthUnaryUpdate.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsValueStackLengthUnaryUpdate(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'valueStack.pop()', 'numResults': 0},
	{'code': 'console.log(valueStack.length)', 'numResults': 0},
	{'code': 'console.log(-valueStack.length)', 'numResults': 0},
	{'code': 'console.log(-context.valueStack.length)', 'numResults': 0},
	{'code': '--valueStack.length', 'numResults': 1},
	{'code': '++valueStack.length', 'numResults': 1},
	{'code': '--context.valueStack.length', 'numResults': 1},
	{'code': '++context.valueStack.length', 'numResults': 1},
	{'code': 'valueStack.length--', 'numResults': 1},
	{'code': 'valueStack.length++', 'numResults': 1},
	{'code': 'valueStack.length.x', 'numResults': 0},
	{'code': 'valueStack.length', 'numResults': 0},
	{'code': 'context.valueStack.length -= 1;', 'numResults': 0},
	{'code': 'valueStack.length-=2', 'numResults': 0},
	{'code': 'context.pop()', 'numResults': 0},
	{'code': 'context.valueStack.pop()', 'numResults': 0},
	];
	processTokenCheckTests(cases, isValueStackLengthUnaryUpdate, logger);
};