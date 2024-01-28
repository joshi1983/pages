import { evaluateStringLiteral } from '../../../../../js-parsing/evaluateStringLiteral.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function assignTokenToJSVarName(token) {
	return token.type === ParseTreeTokenType.IDENTIFIER ?
			token.val : evaluateStringLiteral(token.val)
};