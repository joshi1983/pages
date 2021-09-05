import { shouldInitializeLocalVariables } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/shouldInitializeLocalVariables.js';
import { testInOutPairs } from '../../../../../../helpers/testInOutPairs.js';

export function testShouldInitializeLocalVariables(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'context.turtle.setHeading(this.validateNumber((context.getCurrentExecutingProcedure().localVariables.get("oldheading")) + (((context.repcount()) * 360) / 2)))',
	'out': false},
	{'in': `context.localmake("zx",((context.getCurrentExecutingProcedure().localVariables.get("zx") * context.getCurrentExecutingProcedure().localVariables.get("zx")) - (context.getCurrentExecutingProcedure().localVariables.get("zy") * context.getCurrentExecutingProcedure().localVariables.get("zy"))) + (context.getCurrentExecutingProcedure().localVariables.get("x")))`,
	'out': true},
	{'in': `context.localmake("xt",(context.getCurrentExecutingProcedure().localVariables.get("zx")) * (context.getCurrentExecutingProcedure().localVariables.get("zy")))`,
	'out': true},
	{'in': `context.localmake("maxradius",(context.getCurrentExecutingProcedure().localVariables.get("height")) * 0.101);
context.localmake("minradius",(context.getCurrentExecutingProcedure().localVariables.get("height")) * 0.06);
context.localmake("midradius",((context.getCurrentExecutingProcedure().localVariables.get("maxradius")) + (context.getCurrentExecutingProcedure().localVariables.get("minradius"))) / 2);
context.localmake("vseparation",((context.getCurrentExecutingProcedure().localVariables.get("height")) - (((context.getCurrentExecutingProcedure().localVariables.get("midradius")) * 0.93) * 2)) / 4);
context.localmake("hseparations",[1,2]);
context.valueStack.push("column",1,2,1);`, 'out': true}
	];
	testInOutPairs(cases, shouldInitializeLocalVariables, logger);
};