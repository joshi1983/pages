import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function wrapInCurvedBrackets(token) {
	if (token !== undefined) {
		if (token.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			const openBracket = new ParseTreeToken('(', token.lineIndex, token.colIndex - 1, ParseTreeTokenType.CURVED_LEFT_BRACKET);
			const closeBracket = new ParseTreeToken(')', token.lineIndex, token.colIndex + 1, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
			const e = new ParseTreeToken(null, openBracket.lineIndex, openBracket.colIndex, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
			const parent = token.parentNode;
			token.remove();
			e.appendChild(openBracket);
			e.appendChild(token);
			e.appendChild(closeBracket);
			parent.insertAsFirstChild(e);
		}
		else if (token.children.length < 3) {
			const last = token.children[token.children.length - 1];
			if (last === undefined || last.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
				const closeBracket = new ParseTreeToken(')', token.lineIndex, token.colIndex - 1, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
				token.appendChild(closeBracket);
			}
		}
	}
};