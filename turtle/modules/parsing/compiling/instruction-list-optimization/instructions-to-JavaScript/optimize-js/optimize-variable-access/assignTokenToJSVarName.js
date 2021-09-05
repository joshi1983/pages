import { evaluateStringLiteral } from '../../../../../other-languages/js-parsing/evaluateStringLiteral.js';
import { ParseTreeTokenType } from '../../../../../other-languages/js-parsing/ParseTreeTokenType.js';

export function assignTokenToJSVarName(token) {
	return token.type === ParseTreeTokenType.IDENTIFIER ?
			token.val : evaluateStringLiteral(token.val)
};