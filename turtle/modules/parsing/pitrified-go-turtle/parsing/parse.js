import { addToken } from './addToken.js';
import { fixOperatorPrecedence } from
'./fixOperatorPrecedence.js';
import { isCommentStart } from '../scanning/isCommentStart.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { scan } from '../scanning/scan.js';
import { stringToTokenType } from './stringToTokenType.js';
import { tokenToParseTreeToken } from '../../generic-parsing-utilities/tokenToParseTreeToken.js';

const toParseTreeToken = tokenToParseTreeToken(stringToTokenType);

export function parse(code) {
	const tokens = scan(code);
	const comments = tokens.filter(t => isCommentStart(t.s)).map(tokenToParseTreeToken(stringToTokenType));
	const filteredTokens = tokens.filter(t => !isCommentStart(t.s));
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let prev = root;
	let prevTokenType;
	for (const tok of filteredTokens) {
		const token = toParseTreeToken(tok, prevTokenType);
		prev = addToken(prev, token);
		prevTokenType = token.type;
	}
	fixOperatorPrecedence(root);
	return {
		'comments': comments,
		'root': root
	};
};