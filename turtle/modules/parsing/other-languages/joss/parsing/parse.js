import { addToken } from
'./addToken.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { scan } from
'../scanning/scan.js';
import { stringToParseTreeTokenType } from
'./stringToParseTreeTokenType.js';

export function parse(code) {
	const tokens = scan(code);
	const comments = [];
	const result = new ParseTreeToken(null, 0, 0,
		ParseTreeTokenType.TREE_ROOT);
	let prev = result;
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const pToken = new ParseTreeToken(token.s, token.lineIndex,
			token.colIndex, stringToParseTreeTokenType(token.s));
		prev = addToken(prev, pToken);
	}
	return {
		'root': result,
		'comments': comments
	};
};