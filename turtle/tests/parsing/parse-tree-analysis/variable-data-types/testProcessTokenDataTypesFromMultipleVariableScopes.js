import { DataTypes } from '../../../../modules/parsing/data-types/DataTypes.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { processTokenDataTypesFromMultipleVariableScopes } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/processTokenDataTypesFromMultipleVariableScopes.js';

const numType = new DataTypes('num');

export function testProcessTokenDataTypesFromMultipleVariableScopes(logger) {
	const code = `to p
	if 5 > random 10 [
		localmake "x 5.234
		if 5 < random 10 [
			localmake "x 1
		]
	]
	forward 5 * (:x)
end`;
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const variables = cachedParseTree.getVariables();
	const tokenTypesMap = new Map();
	processTokenDataTypesFromMultipleVariableScopes(cachedParseTree, variables, tokenTypesMap);
	const xReadToken = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ)[0];
	if (xReadToken === undefined)
		logger('Expected to find an x variable read token but did not find it');
	else {
		const xVar = variables.getVariableByName('x');
		const xScopes = xVar.getLocalScopesAt(xReadToken);
		if (xScopes.length === 0)
			logger('At least 1 scope expected but got 0');
		else if (xScopes.length === 1)
			logger('Only 1 scope found which is unexpected.  1 scope also means this test will not reach the target case of multiple scopes.');
		else {
			const types = tokenTypesMap.get(xReadToken);
			if (types === undefined || !types.hasIntersectionWith(numType))
				logger(`Expected to get types of int or num but got ${types}`);
		}
	}
};