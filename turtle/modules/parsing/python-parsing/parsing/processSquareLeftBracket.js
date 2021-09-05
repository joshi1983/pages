import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processSquareLeftBracket(prev, next) {
	const listLiteral = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.LIST_LITERAL);
	listLiteral.appendChild(next);
	prev.appendChild(listLiteral);
	return listLiteral;
};