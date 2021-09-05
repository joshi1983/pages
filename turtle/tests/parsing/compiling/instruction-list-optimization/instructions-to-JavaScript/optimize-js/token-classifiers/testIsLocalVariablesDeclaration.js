import { isLocalVariablesDeclaration } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isLocalVariablesDeclaration.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsLocalVariablesDeclaration(logger) {
	const cases = [
	{
		'code': '', 'numResults': 0
	},
	{
		'code': 'context.localmake("x", 0)', 'numResults': 0
	},
	{
		'code': 'let x = context.readVariable("x")', 'numResults': 0
	},
	{
		'code': 'let x = globalVariables.get("x")', 'numResults': 0
	},
	{
		'code': 'let x = localVariables.get("x")', 'numResults': 0
	},
	{
		'code': 'const localVariables = context.getCurrentExecutingProcedure().localVariables;', 'numResults': 1
	}
	];
	processTokenCheckTests(cases, isLocalVariablesDeclaration, logger);
};