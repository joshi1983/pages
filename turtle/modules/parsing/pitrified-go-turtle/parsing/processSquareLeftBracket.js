import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldCreateArrayLiteral(subscript) {
	const subscriptParent = subscript.parentNode;
	if (subscriptParent.type === ParseTreeTokenType.FUNC)
		return false;
	if (subscriptParent.type === ParseTreeTokenType.IDENTIFIER)
		return false;
	return true;
}

export function processSquareLeftBracket(prev, next) {
	const subscript = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.ARRAY_SUBSCRIPT);
	subscript.appendChild(next);
	prev.appendChild(subscript);
	if (shouldCreateArrayLiteral(subscript)) {
		const arrayLiteral = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.ARRAY_LITERAL);
		const subscriptParent = subscript.parentNode;
		subscriptParent.replaceChild(subscript, arrayLiteral);
		arrayLiteral.appendChild(subscript);
	}
	return subscript;
};