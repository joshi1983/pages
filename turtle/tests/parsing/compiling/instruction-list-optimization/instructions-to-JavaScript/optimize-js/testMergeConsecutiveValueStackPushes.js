import { mergeConsecutiveValueStackPushes } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/mergeConsecutiveValueStackPushes.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testMergeConsecutiveValueStackPushes(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': 'context.valueStack.push(2)', 'changed': false},
	{'in': 'context.valueStack.push(2);', 'changed': false},
	{'in': `context.valueStack.push(2);
context.valueStack.push(context.valueStack.length);`, 'changed': false},
	{'in': `context.valueStack.push(2);
context.valueStack.push(1 + context.valueStack.length);`, 'changed': false},
	{'in': `context.valueStack.push(2);
x = 4;
context.valueStack.push(x);`, 'changed': false},
	{'in': `context.valueStack.push(2);
context.valueStack.push(4);`,
'out': `context.valueStack.push(2,4);`},
	{'in': `context.valueStack.push("v");
context.valueStack.push(10);
context.valueStack.push(context.globalVariables.get("x"));
context.valueStack.push(0.01);`,
'out': `context.valueStack.push("v",10,context.globalVariables.get("x"),0.01);`},
{'in': `context.valueStack.push(wheelradius );
context.valueStack.push(context.readVariable("peddleangle") / context.readVariable("peddlewheelgearratio"));`,
'out': `context.valueStack.push(wheelradius,context.readVariable("peddleangle") / context.readVariable("peddlewheelgearratio"));`}
	];
	testInOutPairs(cases, mergeConsecutiveValueStackPushes, logger);
};