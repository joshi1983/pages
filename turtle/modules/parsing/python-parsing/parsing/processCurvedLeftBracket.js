import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const tuplePrevTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT,
]);

function shouldCreateTupleLiteral(prev) {
	if (tuplePrevTypes.has(prev.type))
		return true;
	return false;
}

export function processCurvedLeftBracket(prev, next) {
	if (shouldCreateTupleLiteral(prev)) {
		const tupleLiteral = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.TUPLE_LITERAL);
		prev.appendChild(tupleLiteral);
		prev = tupleLiteral;
	}
	prev.appendChild(next);
	return prev;
};