import { addToken } from './parsing/addToken.js';
import { fixOperatorPrecedence } from './parsing/fixOperatorPrecedence.js';
import { isCommentStart } from './scanning/isCommentStart.js';
import { ParseTreeToken } from
'../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { scan } from './scanning/scan.js';
import { stringToTokenType } from './stringToTokenType.js';
import { tokenToParseTreeToken } from '../generic-parsing-utilities/tokenToParseTreeToken.js';

const tokenToPToken = tokenToParseTreeToken(stringToTokenType);

/*
settings is optional.
settings should be an object if you want to parse a complete CSS document.
settings should be left undefined, if you want to parse only CSS value expressions like "red" or "rgb(100 255 0)".
*/
export function parse(code, settings) {
	const tokens = scan(code);
	const comments = tokens.filter(t => isCommentStart(t.s)).map(tokenToParseTreeToken(stringToTokenType));
	const filteredTokens = tokens.filter(t => !isCommentStart(t.s));
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let prev = root;
	for (const tok of filteredTokens) {
		const token = tokenToPToken(tok);
		prev = addToken(prev, token, settings);
	}
	fixOperatorPrecedence(root);
	return {
		'comments': comments,
		'root': root
	};
};