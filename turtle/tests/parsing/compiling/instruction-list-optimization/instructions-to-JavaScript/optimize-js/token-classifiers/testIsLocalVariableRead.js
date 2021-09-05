import { isLocalVariableRead } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isLocalVariableRead.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsLocalVariableRead(logger) {
	const cases = [
	{
		'code': '', 'numResults': 0
	}, {
		'code': 'context.make("x", 0)', 'numResults': 0
	}, {
		'code': 'context.localmake("x", 0)', 'numResults': 0
	}, {
		'code': 'context.make("x", 0);context.make("y", 0)', 'numResults': 0
	}, {
		'code': 'context.localmake("x", 0);context.make("y", 0)', 'numResults': 0
	}, {
		'code': 'context.localmake("x", 0);context.localmake("y", 0)',
		'numResults': 0
	}, {
		'code': 'localVariables.get("x")',
		'numResults': 1
	}, {
		'code': 'context.getCurrentExecutingProcedure().localVariables.get("x")',
		'numResults': 1
	}];
	processTokenCheckTests(cases, isLocalVariableRead, logger);
};