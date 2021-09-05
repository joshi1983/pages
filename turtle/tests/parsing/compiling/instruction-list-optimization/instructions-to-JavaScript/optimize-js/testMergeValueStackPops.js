import { mergeValueStackPops } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/mergeValueStackPops.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testMergeValueStackPops(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': 'context.valueStack.pop()', 'changed': false},
	{'in': `context.valueStack.pop();
context.valueStack.pop();`,
'out': `context.valueStack.length -= 2;`},
	{'in': `context.valueStack.pop();
context.valueStack.length -= 1;`,
'out': `context.valueStack.length -= 2;`},
	{'in': `context.valueStack.pop();
context.valueStack.length -= 2;`,
'out': `context.valueStack.length -= 3;`},
	{'in': `valueStack.pop();
valueStack.length -= 2;`,
'out': `valueStack.length -= 3;`},
	{'in': `context.valueStack.pop();
--context.valueStack.length;`,
'out': `context.valueStack.length -= 2;`},
	{'in': `context.valueStack.pop();
context.valueStack.length --;`,
'out': `context.valueStack.length -= 2;`},
	{'in': `context.valueStack.pop();
	context.valueStack.pop();
context.valueStack.length -= 2;
context.valueStack.pop();
context.valueStack.length -= 5;
`,
'out': `context.valueStack.length -= 10;`}
	];
	testInOutPairs(cases, mergeValueStackPops, logger);
};