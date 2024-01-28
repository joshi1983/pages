import { getValueForBinaryOperator } from './token-evaluation/getValueForBinaryOperator.js';
import { getValueForCurvedBracketExpression } from './token-evaluation/getValueForCurvedBracketExpression.js';
import { getValueForList } from './token-evaluation/getValueForList.js';
import { getValueForParameterizedGroup } from './token-evaluation/getValueForParameterizedGroup.js';
import { getValueForUnaryOperator } from './token-evaluation/getValueForUnaryOperator.js';
import { getValueForVariableRead } from './token-evaluation/getValueForVariableRead.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const getValueFunctions = [];
getValueFunctions[ParseTreeTokenType.BINARY_OPERATOR] = getValueForBinaryOperator;
getValueFunctions[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION] = getValueForCurvedBracketExpression;
getValueFunctions[ParseTreeTokenType.LIST] = getValueForList;
getValueFunctions[ParseTreeTokenType.PARAMETERIZED_GROUP] = getValueForParameterizedGroup;
getValueFunctions[ParseTreeTokenType.UNARY_OPERATOR] = getValueForUnaryOperator;

export function getTokenValueAdvanced(token, tokenValueMap, variables) {
	if (tokenValueMap.has(token))
		return tokenValueMap.get(token);
	if (token.type === ParseTreeTokenType.VARIABLE_READ) {
		if (variables !== undefined)
			return getValueForVariableRead(token, variables);
	}
	else {
		const getValueFunc = getValueFunctions[token.type];
		if (getValueFunc !== undefined)
			return getValueFunc(token, tokenValueMap);
	}
};