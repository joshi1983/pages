import { initializeLocalVariables } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/initializeLocalVariables.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

export function testInitializeLocalVariables(logger) {
	const cases = [
	{'in': '', 'out': 'const localVariables = context.getCurrentExecutingProcedure().localVariables;\n'},
	{'in': `context.localmake("zx",((context.getCurrentExecutingProcedure().localVariables.get("zx") * context.getCurrentExecutingProcedure().localVariables.get("zx")) - (context.getCurrentExecutingProcedure().localVariables.get("zy") * context.getCurrentExecutingProcedure().localVariables.get("zy"))) + (context.getCurrentExecutingProcedure().localVariables.get("x")))`,
'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
context.localmake("zx",(( localVariables.get("zx") * localVariables.get("zx")) - ( localVariables.get("zy") * localVariables.get("zy"))) + ( localVariables.get("x")))`},
	{'in': `context.localmake("xt",(context.getCurrentExecutingProcedure().localVariables.get("zx")) * (context.getCurrentExecutingProcedure().localVariables.get("zy")))`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
context.localmake("xt",( localVariables.get("zx")) * ( localVariables.get("zy")))`}
	];
	testInOutPairs(cases, initializeLocalVariables, logger);
};