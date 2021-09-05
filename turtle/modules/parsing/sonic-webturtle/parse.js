import { addToken } from './parsing/addToken.js';
import { filterComments } from './filterComments.js';
import { isComment } from './scanning/isComment.js';
import { ParseTreeToken } from '../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { scan } from './scanning/scan.js';
import { scanTokenToParseToken } from './scanTokenToParseToken.js';

export function parse(code) {
	const tokens = scan(code);
	const comments = filterComments(tokens);
	const commentsSet = new Set(comments);
	const nonComments = tokens.filter(tok => !commentsSet.has(tok));
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let previous = root;
	for (let i = 0; i < nonComments.length; i++) {
		const next = scanTokenToParseToken(nonComments[i]);
		if (next.type === ParseTreeTokenType.COMMENT)
			next.type = ParseTreeTokenType.PROC_START;
		previous = addToken(previous, next);
	}
	return {
		'comments': comments.map(tok => new ParseTreeToken(tok.s, tok.lineIndex, tok.colIndex, ParseTreeTokenType.COMMENT)),
		'root': root
	};
};