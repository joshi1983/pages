import { createRootToken } from
'../../../../helpers/createRootToken.js';
import { getDeclarationsFromInstruction } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/getDeclarationsFromInstruction.js';
import { JavaScriptInstruction } from
'../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedGetDeclarationsFromInstruction(code) {
	const parseToken = createRootToken();
	const namedFunctionsMap = undefined;
	const instruction = new JavaScriptInstruction(code, parseToken, namedFunctionsMap);
	return getDeclarationsFromInstruction(instruction);
}

export function testGetDeclarationsFromInstruction(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let result = localVariables.get("result");
context.valueStack.push(!( result < 0 || localVariables.get("d") < result ))`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let result = localVariables.get("result");\n`}
	];
	testInOutPairs(cases, wrappedGetDeclarationsFromInstruction, logger);
};