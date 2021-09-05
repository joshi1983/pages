import { addToken } from './addToken.js';
import { fixOperatorPrecedence } from './fixOperatorPrecedence.js';
import { getStartingLineIndex } from './getStartingLineIndex.js';
import { isSingleLineComment } from '../scanning/isSingleLineComment.js';
import { mergeSpacedOperators } from '../scanning/token-sanitizers/mergeSpacedOperators.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { runAllSanitizers } from
'../scanning/token-sanitizers/runAllSanitizers.js';
import { sanitizePythonCode } from './code-sanitizers/sanitizePythonCode.js';
import { scan } from
'../scanning/scan.js';
import { stringToParseTreeTokenType } from
'./stringToParseTreeTokenType.js';

export function parse(code, runSanitizers) {
	if (runSanitizers === undefined)
		runSanitizers = true;
	if (typeof runSanitizers !== 'boolean')
		throw new Error(`runSanitizers must either be undefined or boolean but found ${runSanitizers}`);

	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	if (runSanitizers)
		code = sanitizePythonCode(code);
	const allTokens = scan(code);
	if (runSanitizers)
		runAllSanitizers(allTokens);
	const filteredTokens = allTokens.filter(token => !isSingleLineComment(token.s));
	mergeSpacedOperators(filteredTokens);
	const comments = allTokens.filter(token => isSingleLineComment(token.s));
	let prev = root;
	let indentLevel = 0, lastLineIndex = 0;
	for (let i = 0; i < filteredTokens.length; i++) {
		const scanToken = filteredTokens[i];
		const type = stringToParseTreeTokenType(scanToken.s);
		const token = new ParseTreeToken(scanToken.s, scanToken.lineIndex, scanToken.colIndex, type);
		if (getStartingLineIndex(token) !== lastLineIndex) {
			indentLevel = 0;
			lastLineIndex = token.lineIndex;
		}
		if (token.type === ParseTreeTokenType.INDENT)
			indentLevel++;
		token.indentLevel = indentLevel;
		prev = addToken(prev, token);
	}
	fixOperatorPrecedence(root);
	return {
		'comments': comments,
		'root': root
	};
};