import { getDistinctVariableNameDeclared } from './getDistinctVariableNameDeclared.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';

export function getValueExpression(prefix, valueToken, result, settings) {
	if (valueToken.type === ParseTreeTokenType.IDENTIFIER)
		return ':' + valueToken.val;
	if (valueToken.type === ParseTreeTokenType.NUMBER_LITERAL)
		return valueToken.val;
	const varName = getDistinctVariableNameDeclared(valueToken, result, prefix, settings);
	processToken(valueToken, result, settings);
	result.append('\n');
	return ':' + varName;
};