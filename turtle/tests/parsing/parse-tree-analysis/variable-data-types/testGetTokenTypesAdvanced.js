import { DataTypes } from '../../../../modules/parsing/data-types/DataTypes.js';
import { getAnalyzedVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getTokenTypesAdvanced } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getTokenTypesAdvanced.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
await DataTypes.asyncInit();
await ParseTreeToken.asyncInit();

export function testGetTokenTypesAdvanced(logger) {
	const code = 'make "x 5\nprint -:x';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const variables = getAnalyzedVariables(cachedParseTree);
	const tokenToTypesMap = new Map();
	const varReadToken = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ).filter(
		t => t.val === 'x')[0];
	if (varReadToken === undefined)
		logger('x variable read token not found');
	tokenToTypesMap.set(varReadToken, new DataTypes('int'));
	const minusToken = cachedParseTree.getAllTokens().filter(t => t.val === '-')[0];
	const minusTypes = getTokenTypesAdvanced(minusToken, variables, tokenToTypesMap);
	if (minusTypes === undefined)
		logger('Expected - types to be int but got undefined');
};