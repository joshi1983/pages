import { reduceValueStackPushes } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/reduceValueStackPushes.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testReduceValueStackPushes(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': 'context.valueStack.pop()', 'changed': false},
	{'in': 'context.valueStack.push()', 'changed': false},
	{'in': 'context.valueStack.push(12)', 'changed': false},
	{'in': `context.valueStack.push(12);
context.valueStack.pop()`, 'out': ''},
	{'in': `context.valueStack.push(12);
context.turtle.forward(100);
context.valueStack.pop()`, 'out': `
context.turtle.forward(100);`},
	{'in': `context.valueStack.push(1, 2);
context.valueStack.pop()`,
'out': 'context.valueStack.push(1 );'},
	{'in': `context.valueStack.push(1, 2);
context.valueStack.length -= 2`,
'out': ``},
	{'in': `context.valueStack.push(1, 2);;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
context.valueStack.length -= 2`,
'out': ``},
	{'in': `context.valueStack.push(12);
context.turtle.print(context.valueStack[context.valueStack.length - 1]);
context.valueStack.pop()`,
'out': `
context.turtle.print( 12 );`},
	{'in': `context.valueStack.push("hello world");
context.turtle.print(context.valueStack[context.valueStack.length - 1]);
context.valueStack.pop()`,
'out': `
context.turtle.print( "hello world" );`},
	{'in': `context.valueStack.push("hello world");
context.valueStack[context.valueStack.length - 1] = 3;
context.valueStack.pop()`,
'out': ''},
	{'in': `context.valueStack.push("hello world");
context.valueStack[context.valueStack.length - 1] = 3;
context.valueStack[context.valueStack.length - 2] = 1 + context.valueStack[context.valueStack.length - 1];
context.valueStack.pop()`,
'changed': false},
	{'in': `context.valueStack.push(1, 2);
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 1] * context.valueStack[context.valueStack.length - 2];
context.valueStack.pop()`,
'out': `context.valueStack.push(1 );
context.valueStack[context.valueStack.length - 1] = 2 * context.valueStack[context.valueStack.length - 1];`},
	{'in': `context.valueStack.push(1, 2);;;;;;;;;;;;;;;;;;;;;;;;;;;;;
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 1] * context.valueStack[context.valueStack.length - 2];
context.valueStack.pop()`,
'out': `context.valueStack.push(1 );
context.valueStack[context.valueStack.length - 1] = 2 * context.valueStack[context.valueStack.length - 1];`},
	{'in': `context.valueStack.push(1, 2);
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 1] * context.valueStack[context.valueStack.length - 2];
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 1] + context.valueStack[context.valueStack.length - 2];
context.valueStack.pop()`,
'out': `context.valueStack.push(1 );
context.valueStack[context.valueStack.length - 1] = 2 * context.valueStack[context.valueStack.length - 1];
context.valueStack[context.valueStack.length - 1] = 2 + context.valueStack[context.valueStack.length - 1];`},
	{'in': `context.valueStack.push(200);
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] / context.valueStack[context.valueStack.length - 1];
context.valueStack.pop();`, 'out': `
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] / 200 ;`},
	{'in': `context.valueStack.push(50);
context.valueStack[context.valueStack.length - 0] = context.repcount();
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] - context.valueStack[context.valueStack.length - 1];
context.valueStack.pop();
context.valueStack.push(50);
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] / context.valueStack[context.valueStack.length - 1];
context.valueStack.pop();`, 'out': `context.valueStack.push(50);
context.valueStack[context.valueStack.length - 0] = context.repcount();
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] - context.valueStack[context.valueStack.length - 1];
context.valueStack.pop();

context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] / 50 ;`},
	{'in': `context.valueStack[context.valueStack.length - 0] = 3;
context.turtle.forward(context.valueStack[context.valueStack.length - 1]);
context.valueStack.pop();`, 'out': `
context.turtle.forward( 3 );`}
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.changed === false)
			caseInfo.out = caseInfo.in;
	});
	testInOutPairs(cases, reduceValueStackPushes, logger);
};