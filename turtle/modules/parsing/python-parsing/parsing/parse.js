import { addToken } from './addToken.js';
import { fixOperatorPrecedence } from './fixOperatorPrecedence.js';
import { isSingleLineComment } from '../scanning/isSingleLineComment.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { runAllSanitizers } from
'../scanning/token-sanitizers/runAllSanitizers.js';
import { scan } from
'../scanning/scan.js';
import { stringToParseTreeTokenType } from
'./stringToParseTreeTokenType.js';

export function parse(code) {
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	const allTokens = scan(code);
	//runAllSanitizers(allTokens);
	const filteredTokens = allTokens.filter(token => !isSingleLineComment(token.s));
	const comments = allTokens.filter(token => isSingleLineComment(token.s));
	let prev = root;
	for (let i = 0; i < filteredTokens.length; i++) {
		const scanToken = filteredTokens[i];
		const type = stringToParseTreeTokenType(scanToken.s);
		const token = new ParseTreeToken(scanToken.s, scanToken.lineIndex, scanToken.colIndex, type);
		prev = addToken(prev, token);
	}
	fixOperatorPrecedence(root);
	return {
		'comments': comments,
		'root': root
	};
};