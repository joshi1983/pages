import { isJSVariableAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isJSVariableAssignment.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsJSVariableAssignment(logger) {
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
		'code': 'x = 4',
		'numResults': 1
	}, {
		'code': 'x = context.globalVariables.get("x")',
		'numResults': 1
	}, {
		'code': 'x = globalVariables.get("x")',
		'numResults': 1
	}, {
		'code': 'x = localVariables.get("x")',
		'numResults': 1
	}, {
		'code': 'x += 4',
		'numResults': 1
	}, {
		'code': 'x -= 4',
		'numResults': 1
	}, {
		'code': 'x *= 4',
		'numResults': 1
	}, {
		'code': 'x /= 4',
		'numResults': 1
	}, {
		'code': 'x ++',
		'numResults': 1
	}, {
		'code': '++x',
		'numResults': 1
	}, {
		'code': 'X = 4',
		'numResults': 1
	}, {
		'code': 'let X = 4',
		'numResults': 1
	}];
	processTokenCheckTests(cases, isJSVariableAssignment, logger);
};