import { forToConditionToken } from './forToConditionToken.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function forTokenToConditionVariableName(forToken) {
	const conditionToken = forToConditionToken(forToken);
	if (conditionToken === null)
		return;
	if (conditionToken.type === ParseTreeTokenType.BINARY_OPERATOR) {
		const identifierChildren = conditionToken.children.filter(t => t.type === ParseTreeTokenType.IDENTIFIER);
		if (identifierChildren.length === 1)
			return identifierChildren[0].val;
		if (identifierChildren.length === 2) {
			const initVariableName = forTokenToInitVariableName(forToken);
			if (identifierChildren.some(t => t.val === initVariableName))
				return initVariableName;
		}
	}
};