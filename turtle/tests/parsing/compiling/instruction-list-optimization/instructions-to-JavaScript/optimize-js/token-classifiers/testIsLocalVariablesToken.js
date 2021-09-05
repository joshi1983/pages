import { prefixWrapper } from '../../../../../../helpers/prefixWrapper.js';
import { isGetCurrentExecutingProcedureCall, isLocalVariablesToken } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isLocalVariablesToken.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

function testIsGetCurrentExecutingProcedureCall(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'context.turtle.setHeading(this.validateNumber((context.getCurrentExecutingProcedure().localVariables.get("oldheading")) + (((context.repcount()) * 360) / 2)))',
	'numResults': 1},
	{'code': 'context.getCurrentExecutingProcedure().localVariables.get("oldheading")',
	'numResults': 1},
	{'code': 'context.getCurrentExecutingProcedure()',
	'numResults': 1},
	{'code': `context.localmake("zx",((context.getCurrentExecutingProcedure().localVariables.get("zx") * context.getCurrentExecutingProcedure().localVariables.get("zx")) - (context.getCurrentExecutingProcedure().localVariables.get("zy") * context.getCurrentExecutingProcedure().localVariables.get("zy"))) + (context.getCurrentExecutingProcedure().localVariables.get("x")))`,
	'numResults': 5}
	];
	processTokenCheckTests(cases, isGetCurrentExecutingProcedureCall, logger);
}

export function testIsLocalVariablesToken(logger) {
	testIsGetCurrentExecutingProcedureCall(prefixWrapper('testIsGetCurrentExecutingProcedureCall', logger));
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'context.getCurrentExecutingProcedure().localVariables.get("oldheading")',
	'numResults': 1},
	{'code': 'context.getCurrentExecutingProcedure()',
	'numResults': 0},
	{'code': 'context.turtle.setHeading(this.validateNumber((context.getCurrentExecutingProcedure().localVariables.get("oldheading")) + (((context.repcount()) * 360) / 2)))',
	'numResults': 1},
	{'code': `context.localmake("zx",((context.getCurrentExecutingProcedure().localVariables.get("zx") * context.getCurrentExecutingProcedure().localVariables.get("zx")) - (context.getCurrentExecutingProcedure().localVariables.get("zy") * context.getCurrentExecutingProcedure().localVariables.get("zy"))) + (context.getCurrentExecutingProcedure().localVariables.get("x")))`,
	'numResults': 5}
	];
	processTokenCheckTests(cases, isLocalVariablesToken, logger);
};