import { containsDynamicVariableAssignment } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/containsDynamicVariableAssignment.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testContainsDynamicVariableAssignment(logger) {
	const cases = [
	{
		'in': '',
		'out': false
	},
	{
		'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let result = localVariables.get("result");
context.valueStack.push(!( result < 0 || localVariables.get("d") < result ))`,
		'out': false
	},
	{
		'in': 'localVariables.set("x", 3)',
		'out': false
	},
	{
		'in': 'context.localmake("x", 3)',
		'out': false
	},
	{
		'in': 'context.localmake("result",context.getCurrentExecutingProcedure().localVariables.get("d"))',
		'out': false
	}
	];
	testInOutPairs(cases, containsDynamicVariableAssignment, logger);
};