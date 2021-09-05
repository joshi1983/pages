import { isJSVariableDeclareAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isJSVariableDeclareAssignment.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsJSVariableDeclareAssignment(logger) {
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
		'code': 'x = 4;', 'numResults': 0 // not a declaration because there is no const, let, or var.
	}, {
		'code': 'let x = 1;', 'numResults': 0
	}, {
		'code': 'let x = context.readVariable("x");', 'numResults': 1
	}, {
		'code': 'let x = localVariables.get("x");', 'numResults': 1
	}, {
		'code': 'let column = localVariables.get("column");', 'numResults': 1
	}, {
		'code': 'let colorindex = context.getCurrentExecutingProcedure().localVariables.get("colorindex");',
		'numResults': 1
	}];
	processTokenCheckTests(cases, isJSVariableDeclareAssignment, logger);
};