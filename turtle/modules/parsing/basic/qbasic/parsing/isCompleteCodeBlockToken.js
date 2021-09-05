import { isSingleLineCodeBlock } from './isSingleLineCodeBlock.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isCompleteCodeBlockToken(token, next) {
	const children = token.children;
	if (token.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	if (isSingleLineCodeBlock(token) && token.lineIndex !== next.lineIndex)
		return true;
	if (children.length !== 1)
		return false;
	const parent = token.parentNode;
	if ((parent.type === ParseTreeTokenType.IF ||
	parent.type === ParseTreeTokenType.ELSE) &&
	parent.children.length >= 3) {
		let sameLineToken;
		if (parent.type === ParseTreeTokenType.IF ||
		parent.type === ParseTreeTokenType.ELSEIF)
			sameLineToken = parent.children[1];
		else
			sameLineToken = parent;
		const child = children[0];
		if (next !== undefined && next.lineIndex === sameLineToken.lineIndex)
			return false;
		if (sameLineToken.lineIndex === child.lineIndex)
			return true;
	}
	return false;
};