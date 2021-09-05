import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { isListAppendMethodCall } from './processAppendCall.js';

export function isSpecialMethodCall(token) {
	while (token !== null) {
		if (token.type === ParseTreeTokenType.FUNCTION_CALL && token.val === 'append')
			return isListAppendMethodCall(token);
		if (token.children.length !== 1)
			return false;
		else
			token = token.children[0];
	}
	return false;
};