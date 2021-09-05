import { convertToEndFunctionCall } from
'./convertToEndFunctionCall.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.END_IF,
]);

const typesForConvertingToEndIf = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

function getEndIfTokenInfo(prev, next) {
	if (!typesForConvertingToEndIf.has(prev.type))
		return;
	const endToken = prev.children[prev.children.length - 1];
	if (endToken === undefined || endToken.type !== ParseTreeTokenType.END ||
	endToken.lineIndex !== next.lineIndex)
		return;
	const tokensForCodeBlock = [];
	let tok = endToken.getPreviousSibling();
	while (tok !== null && tok.type !== ParseTreeTokenType.IF) {
		tokensForCodeBlock.splice(0, 0, tok);
		tok = tok.getPreviousSibling();
	}
	if (tok === null)
		return;
	const tokensToRemove = [];
	const ifToken = tok;
	if (ifToken.children.length !== 4)
		return;
	const endIfToRemove = ifToken.children[3];
	if (endIfToRemove.children.length !== 1)
		return;
	const codeBlock = ifToken.children[2];
	tokensForCodeBlock.splice(0, 0, endIfToRemove.children[0]); // insert at beginning of array.
	tokensToRemove.push(endIfToRemove);
	return {
		'codeBlock': codeBlock,
		'endToken': endToken,
		'ifToken': ifToken,
		'tokensForCodeBlock': tokensForCodeBlock,
		'tokensToRemove': tokensToRemove
	};
}

function isGoodPrevious(token, next) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.END_IF) {
		const children = token.children;
		if (children.length >= 2)
			return false;
		if (children.length === 1 &&
		token.lineIndex !== next.lineIndex)
			return false;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token, next) {
	while (!isGoodPrevious(token, next))
		token = token.parentNode;
	return token;
}

export function processIf(prev, next) {
	prev = getGoodPrevious(prev, next);
	const endIfTokenInfo = getEndIfTokenInfo(prev, next);
	if (endIfTokenInfo !== undefined) {
		const endToken = endIfTokenInfo.endToken;
		const codeBlock = endIfTokenInfo.codeBlock;
		const endIf = new ParseTreeToken(null, endToken.lineIndex, endToken.colIndex, ParseTreeTokenType.END_IF);
		for (const token of endIfTokenInfo.tokensToRemove) {
			token.remove();
		}
		for (const token of endIfTokenInfo.tokensForCodeBlock) {
			token.remove();
			codeBlock.appendChild(token);
			if (token.type === ParseTreeTokenType.END)
				convertToEndFunctionCall(token, codeBlock);
		}
		endToken.remove();
		endIf.appendChild(endToken);
		endIf.appendChild(next);
		endIfTokenInfo.ifToken.appendChild(endIf);
		return endIf;
	}
	prev.appendChild(next);
	return next;
};