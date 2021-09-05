import { removeTrailingLocalSetCalls } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/final-optimize/removeTrailingLocalSetCalls.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

export function testRemoveTrailingLocalSetCalls(logger) {
	const cases = [
	{'in': `globalVariables.set("x", 4)`,
	'changed': false
	},
	{'in': `context.globalVariables.set("x", 4)`,
	'changed': false
	},
	{'in': `localVariables.set("x", 4)`,
	'out': ''
	},
	{'in': `context.make("x",1);
context.localmake("x",2);
context.turtle.print(context.getCurrentExecutingProcedure().localVariables.get("x"));`,
	'changed': false}
	];
	testInOutPairs(cases, removeTrailingLocalSetCalls, logger);
};