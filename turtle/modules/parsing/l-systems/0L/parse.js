import { addToken } from './parsing/addToken.js';
import { isCommentStart } from './scanning/isCommentStart.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'./ParseTreeTokenType.js';
import { scan } from './scanning/scan.js';
import { scanTokenToParseTreeToken } from './scanTokenToParseTreeToken.js';

export function parse(code) {
	const tokens = scan(code);
	const comments = tokens.filter(t => isCommentStart(t.s)).map(scanTokenToParseTreeToken);
	const filteredTokens = tokens.filter(t => !isCommentStart(t.s));
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let prev = root;
	for (const tok of filteredTokens) {
		const token = scanTokenToParseTreeToken(tok);

		// If the line breaks, go back to the root.
		if (token.lineIndex !== prev.lineIndex)
			prev = root;
		prev = addToken(prev, token);
	}
	return {
		'comments': comments,
		'root': root
	};
};