import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function safelyMoveGlobalFromTokenDown(token) {
	/*
	There is no need for global variables to include the first procedure in their 
	fromToken - toToken range.
	*/
	while (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
	token.nextSibling !== null &&
	token.nextSibling.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		token = token.nextSibling;

	while (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
	token.children.length !== 0 &&
	token.children[token.children.length - 1].type === ParseTreeTokenType.PROCEDURE_END_KEYWORD)
		token = token.children[token.children.length - 1]; // the end token
	return token;
};