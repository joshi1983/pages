import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function testCurvedBracket(logger) {
	const code = `to p
	if true [
		localmake "x 5.234
		localmake "x 1
	]
	forward 5 * (:x)
end`;
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const variables = cachedParseTree.getVariables();
	const varReadToken = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ)[0];
	const curvedBracketToken = cachedParseTree.getTokensByType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)[0];
	const xVariable = variables.getVariableByName('x');
	if (xVariable === undefined)
		logger('Expected to get a variable named x but did not');
	const tokenToTypesMap = new Map();
	if (curvedBracketToken === undefined)
		logger('Unable to find curved bracket expression token');
	else {
		if (xVariable !== undefined) {
			const variableScopes = xVariable.getLocalScopesAt(curvedBracketToken);
			if (variableScopes.length < 1)
				logger(`Expected to have at least 1 x variable scope at the curved bracket expression token but got ${variableScopes.length}`);
		}
		const varReadTypes = cachedParseTree.getPossibleTypesFromToken(varReadToken, variables, tokenToTypesMap);
		if (varReadTypes === undefined || varReadTypes.isEmpty())
			logger(`Expected :x to have types like num or int but got: ${varReadTypes}`);
		const expressionTypes = cachedParseTree.getPossibleTypesFromToken(curvedBracketToken, variables, tokenToTypesMap);
		if (expressionTypes === undefined || expressionTypes.isEmpty())
			logger(`Expected (:x) to have types like num or int but got: ${expressionTypes}`);
	}
}

export function testCachedParseTreeGetPossibleTypesFromToken(logger) {
	testCurvedBracket(prefixWrapper('testCurvedBracket', logger));	
};