import { addToken } from './addToken.js';
import { fixOperatorPrecedence } from './fixOperatorPrecedence.js';
import { isComment } from '../scanning/isComment.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { simplifyTree } from
'./tree-simplifiers/simplifyTree.js';
import { scan } from '../scanning/scan.js';
import { scanTokenToParseTreeToken } from
'../scanTokenToParseTreeToken.js';

export function parse(code) {
	const tokens = scan(code);
	const comments = tokens.filter(t => isComment(t.s)).map(scanTokenToParseTreeToken);
	const filteredTokens = tokens.filter(t => !isComment(t.s));
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let prev = root;
	let prevType = root.type;
	for (const tok of filteredTokens) {
		const token = scanTokenToParseTreeToken(tok, prevType);
		prev = addToken(prev, token);
		if (typeof prev !== 'object')
			throw new Error(`prev must be an object but found ${prev}.  tok.s=${tok.s}`);
		prevType = token.type;
	}
	simplifyTree(root);
	fixOperatorPrecedence(root);
	return {
		'comments': comments,
		'root': root
	};
};