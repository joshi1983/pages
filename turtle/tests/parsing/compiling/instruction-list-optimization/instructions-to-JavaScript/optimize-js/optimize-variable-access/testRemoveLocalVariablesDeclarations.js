import { removeLocalVariablesDeclarations } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/removeLocalVariablesDeclarations.js';
import { testInOutPairs } from '../../../../../../helpers/testInOutPairs.js';

export function testRemoveLocalVariablesDeclarations(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'const localVariables = context.getCurrentExecutingProcedure().localVariables', 'out': ''},
	{'in': 'const localVariables = context.getCurrentExecutingProcedure().localVariables;', 'out': ';'},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let x = localVariables.get("x");`, 'out': ';\nlet x = localVariables.get("x");'}
	];
	testInOutPairs(cases, removeLocalVariablesDeclarations, logger);
};