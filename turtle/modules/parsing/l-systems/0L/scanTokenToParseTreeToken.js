import { isCommentStart } from './scanning/isCommentStart.js';
import { isCompleteArrow } from './scanning/isCompleteArrow.js';
import { isCompleteNumberLiteral } from './scanning/isCompleteNumberLiteral.js';
import { isIdentifier } from './scanning/isIdentifier.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

const sTypeMap = new Map([
	['=', ParseTreeTokenType.ASSIGNMENT],
	[':', ParseTreeTokenType.COLON],
]);

for (const ch of '|[]()+-{}#!<>&@'.split('')) {
	sTypeMap.set(ch, ParseTreeTokenType.COMMAND_SYMBOL);
}
const specialValues = Array.from(sTypeMap.keys());
export { specialValues };

export function scanTokenToParseTreeToken(token) {
	if (token === undefined)
		return undefined;
	let type = sTypeMap.get(token.s);
	if (type === undefined) {
		if (isCommentStart(token.s))
			type = ParseTreeTokenType.COMMENT;
		else if (isCompleteArrow(token.s))
			type = ParseTreeTokenType.ARROW;
		else if (isIdentifier(token.s))
			type = ParseTreeTokenType.IDENTIFIER;
		else if (isCompleteNumberLiteral(token.s))
			type = ParseTreeTokenType.NUMBER_LITERAL;
		else {
			type = ParseTreeTokenType.UNRECOGNIZED;
		}
	}
	let originalString;
	
	return new ParseTreeToken(token.s, token.lineIndex, token.colIndex, type, originalString);
};