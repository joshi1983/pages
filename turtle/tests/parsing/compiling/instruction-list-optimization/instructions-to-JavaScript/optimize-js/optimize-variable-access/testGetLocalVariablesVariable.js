import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getLocalVariablesVariableToken } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getLocalVariablesVariableToken.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

function f(code) {
	const parseResult = parse(code);
	const allTokens = flatten(parseResult.root);
	return getLocalVariablesVariableToken(allTokens) !== undefined;
}

export function testGetLocalVariablesVariable(logger) {
	const cases = [
	{'in': '', 'out': false},
	{
		'in': 'let localVariables = context.getCurrentExecutingProcedure().localVariables;\n',
		'out': true
	}
	];
	testInOutPairs(cases, f, logger);
};