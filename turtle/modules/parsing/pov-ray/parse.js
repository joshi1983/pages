import { addToken } from './parsing/addToken.js';
import { groupChildrenOfParameterizedGroups } from './parsing/groupChildrenOfParameterizedGroups.js';
import { isComment } from './scanning/isComment.js';
import { ParseTreeToken } from
'../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'./ParseTreeTokenType.js';
import { scan } from './scanning/scan.js';
import { stringToTokenType } from './stringToTokenType.js';
import { tokenToParseTreeToken } from './tokenToParseTreeToken.js';

export function parse(code) {
	const tokens = scan(code);
	const comments = tokens.filter(t => isComment(t.s)).map(tokenToParseTreeToken);
	const filteredTokens = tokens.filter(t => !isComment(t.s));
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let prev = root;
	for (const tok of filteredTokens) {
		const token = tokenToParseTreeToken(tok);
		prev = addToken(prev, token);
	}
	groupChildrenOfParameterizedGroups(root);
	return {
		'comments': comments,
		'root': root
	};
};