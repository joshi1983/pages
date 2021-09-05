import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { getTokensByType } from '../../../modules/parsing/parse-tree-analysis/cached-parse-tree/getTokensByType.js';
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
	const varReadToken = getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ)[0];
	const curvedBracketToken = getTokensByType(cachedParseTree, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)[0];
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

function testGeneralCases(logger) {
	const cases = [{
		'code': `to p :radius
	localmake "x pos
	localmake "size2 :radius * 0.2

	jumpTo :x
	repeat 2 [
		localmake "size2 -:size2
	]
end

p 100`, 'checks': [
{
	'token': {
		'val': 'x',
		'type': ParseTreeTokenType.VARIABLE_READ
	},
	'types': 'list'
},
{
	'token': {
		'val': 'radius',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'hasParentVal': '*'
	},
	'types': 'int'
}
]}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = tree.getAllTokens();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const cLogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, cLogger);
			if (token !== undefined) {
				const tokenTypes = tree.getPossibleTypesFromToken(token);
				if (tokenTypes === undefined)
					cLogger(`Expected to find types ${checkInfo.types} but got undefined`);
				else if (DataTypes.stringify(tokenTypes) !== checkInfo.types)
					cLogger(`Expected to find types ${checkInfo.types} but got ${DataTypes.stringify(tokenTypes)}`);
			}
		});
	});
}

export function testCachedParseTreeGetPossibleTypesFromToken(logger) {
	testCurvedBracket(prefixWrapper('testCurvedBracket', logger));
	testGeneralCases(prefixWrapper('testGeneralCases', logger));
};