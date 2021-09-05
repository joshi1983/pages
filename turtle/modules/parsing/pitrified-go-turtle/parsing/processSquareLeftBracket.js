import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldCreateArrayLiteral(subscript) {
	const subscriptParent = subscript.parentNode;
	if (subscriptParent.type === ParseTreeTokenType.FUNC ||
	subscriptParent.type === ParseTreeTokenType.ARRAY_LITERAL)
		return false;
	const grandParent = subscriptParent.parentNode;
	if (subscriptParent.type === ParseTreeTokenType.IDENTIFIER &&
	grandParent.type !== ParseTreeTokenType.VAR)
		return false;

	const dte = getClosestOfType(subscript, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
	return dte === null;
}

function shouldCreateDataTypeExpression(subscript) {
	const parent = subscript.parentNode;
	if (parent.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const grandparent = parent.parentNode;
	return grandparent.type === ParseTreeTokenType.VAR;
}

function shouldCreateSubscripts(subscript) {
	const prevSubscript = subscript.getPreviousSibling();
	if (prevSubscript === null || prevSubscript.type !== ParseTreeTokenType.ARRAY_SUBSCRIPT)
		return false;

	return true;
}

function shouldCreateTypeParameters(prev) {
	if (prev.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const prevParent = prev.parentNode;
	if (prevParent.type !== ParseTreeTokenType.TYPE &&
	prevParent.type !== ParseTreeTokenType.FUNC)
		return false;
	
	return prevParent.children.length === 1;
}

export function processSquareLeftBracket(prev, next) {
	const firstType = shouldCreateTypeParameters(prev) ? ParseTreeTokenType.TYPE_PARAMETERS : ParseTreeTokenType.ARRAY_SUBSCRIPT;
	const subscript = new ParseTreeToken(null, next.lineIndex, next.colIndex, firstType);
	subscript.appendChild(next);
	prev.appendChild(subscript);
	if (firstType === ParseTreeTokenType.ARRAY_SUBSCRIPT) {
		if (shouldCreateArrayLiteral(subscript) ||
		shouldCreateDataTypeExpression(subscript)) {
			const type = shouldCreateDataTypeExpression(subscript) ? ParseTreeTokenType.DATA_TYPE_EXPRESSION : ParseTreeTokenType.ARRAY_LITERAL;
			const arrayLiteral = new ParseTreeToken(null, next.lineIndex, next.colIndex, type);
			const subscriptParent = subscript.parentNode;
			subscriptParent.replaceChild(subscript, arrayLiteral);
			arrayLiteral.appendChild(subscript);
		}
		else if (shouldCreateSubscripts(subscript)) {
			const prevSubscript = subscript.getPreviousSibling();
			const arraySubscripts = new ParseTreeToken(null, prevSubscript.lineIndex, prevSubscript.colIndex, ParseTreeTokenType.ARRAY_SUBSCRIPTS);
			const subscriptParent = prevSubscript.parentNode;
			subscriptParent.replaceChild(prevSubscript, arraySubscripts);
			subscript.remove();
			arraySubscripts.appendChild(prevSubscript);
			arraySubscripts.appendChild(subscript);
		}
	}
	return subscript;
};