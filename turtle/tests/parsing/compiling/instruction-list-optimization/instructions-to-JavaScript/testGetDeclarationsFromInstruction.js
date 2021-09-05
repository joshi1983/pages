import { createRootToken } from
'../../../../helpers/createRootToken.js';
import { getDeclarationsFromInstruction } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/getDeclarationsFromInstruction.js';
import { JavaScriptInstruction } from
'../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { PushInstruction } from
'../../../../../modules/parsing/execution/instructions/PushInstruction.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

function wrappedGetDeclarationsFromInstruction(code) {
	const parseToken = createRootToken();
	const namedFunctionsMap = undefined;
	const instruction = new JavaScriptInstruction(code, parseToken, namedFunctionsMap);
	return getDeclarationsFromInstruction(instruction);
}

function testWithJavaScriptInstructions(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'let x = 3', 'out': 'let x = 3;\n'},
	{'in': 'let x = f()', 'out': 'let x = f();\n'},
	{'in': 'let x = f();', 'out': 'let x = f();\n'},
	{'in': 'let x = context.f();', 'out': 'let x = context.f();\n'},
	{'in': 'let x = context.f();context.valueStack.push(!( x < 3 ))', 'out': 'let x = context.f();\n'},
	{'in': 'let x = context.readVariable("x")', 'out': 'let x = context.readVariable("x");\n'},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let result = localVariables.get("result");
context.valueStack.push(!( result < 0 || localVariables.get("d") < result ))`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let result = localVariables.get("result");\n`},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let arcinfo = localVariables.get("arcinfo");
let height = localVariables.get("height");
arcinfo=[-0.255,0,16,53,0.85] ;
context.turtle.jumpRight( height * arcinfo [1 - 1] );
localVariables. set("arcangle",arcinfo [4 - 1]);
localVariables. set("arcradius", height * arcinfo [5 - 1] );
context.valueStack.push(localVariables. get("arcangle") < 0);
localVariables.set("arcinfo", arcinfo);`, 'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let arcinfo = localVariables.get("arcinfo");
let height = localVariables.get("height");\n`}
	];
	testInOutPairs(cases, wrappedGetDeclarationsFromInstruction, logger);
}

function testWithPushInstructions(logger) {
	const parseToken = createRootToken();
	const isCloningValue = false;
	const instruction = new PushInstruction(3, parseToken, isCloningValue);
	const result = getDeclarationsFromInstruction(instruction);
	if (result !== '')
		logger(`Expected "" but got ${result}`);
}

export function testGetDeclarationsFromInstruction(logger) {
	wrapAndCall([
		testWithJavaScriptInstructions,
		testWithPushInstructions
	], logger);
};