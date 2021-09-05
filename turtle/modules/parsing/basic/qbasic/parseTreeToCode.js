import { flatten } from
'../../generic-parsing-utilities/flatten.js';
import { getParseTokensSorted } from
'../../parse-tree-token/getParseTokensSorted.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { StringBuffer } from '../../../StringBuffer.js';
import { StringUtils } from '../../../StringUtils.js';
import { indexOfWhitespace } from
'../../../components/code-editor/format/whitespaceUtils.js';
const whitespaceExpr = /\s/;

const typesNeedingSpaces = new Set([
	ParseTreeTokenType.AS,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.DEF_PRIMITIVE,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.END,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.ON,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.STEP,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.SUB,
	ParseTreeTokenType.THEN,
	ParseTreeTokenType.TYPE,
	ParseTreeTokenType.UNTIL,
	ParseTreeTokenType.WEND,
	ParseTreeTokenType.WHILE,
]);
const noSpaceNeededVals = new Set(['=', ',', '(', ')', ':']);

/*
This is like modules/parsing/parseTreeToCodeWithComments.js but
qbasic/parseTreeToCode.js is for QBASIC.

Another difference is that qbasic/parseTreeToCode.js does not process comments.
It doesn't output code intended for end users.
The outputted code is merely for troubleshooting purposes.
*/

/*
Returns a map from every parse token to a character index
from the originalCode for the last character in each token.
*/
export function getTokenIndexes(tokens, originalCode) {
	if (!(tokens instanceof Array))
		throw new Error('tokens must be an Array');
	const result = new Map();
	const lines = originalCode.split('\n');
	const lineCharIndexes = [];
	// stores character offsets for the first character from each line.
	let total = 0;
	lines.forEach(function(line) {
		lineCharIndexes.push(total);
		total += line.length + 1;
	});
	tokens.forEach(function(token) {
		let index = lineCharIndexes[token.lineIndex] + token.colIndex;
		result.set(token, index);
	});
	return result;
};

export function singleTokenToString(parseToken) {
	if (!(parseToken instanceof ParseTreeToken))
		throw new Error('parseToken must be a ParseTreeToken.  Not: ' + parseToken);
	if (parseToken.val === null)
		return null;
	return '' + parseToken.val;
};

function indexOfNextNonParsableCharacter(s, startIndex, currentParseToken) {
	const index = indexOfWhitespace(s, startIndex);
	const colonIndex = s.indexOf(';', startIndex);
	if (index === -1)
		return colonIndex;
	if (colonIndex === -1)
		return index;
	return Math.min(index, colonIndex);
}

/*
Checks if a pair of adjacent tokens should be separated by a space.
*/
function isSpaceImportantForTokenPair(prevToken, nextToken) {
	if (nextToken === undefined || prevToken === undefined)
		return false;

	if (prevToken.type === ParseTreeTokenType.UNARY_OPERATOR ||
	noSpaceNeededVals.has(prevToken.val) || noSpaceNeededVals.has(nextToken.val))
		return false;

	if (nextToken.val !== null && /\s/.test(nextToken.val) === false) {
		if (prevToken.lineIndex < nextToken.lineIndex)
			return false; // the line will be broken and that is enough.
			// we don't need a new regular space character.

		const prevColIndex = nextToken.colIndex - nextToken.val.length;
		if (prevColIndex > prevToken.colIndex)
			return true;
	}

	if (typesNeedingSpaces.has(prevToken.type) ||
	typesNeedingSpaces.has(nextToken.type))
		return true;
	return false;
}

function appendWithLineBreaks(result, token) {
	const s = singleTokenToString(token);
	const sLineCount = StringUtils.countChar(s, '\n');
	if (token.lineIndex > result.lineCount + sLineCount)
		result.append('\n'.repeat(token.lineIndex - result.lineCount - sLineCount));
	result.append(s);
}

function processChangedTokens(treeRoot, originalCode) {
	// Filter new lines out because they're in the originalCode anyway.
	let parseTokens = flatten(treeRoot).filter(t =>
		singleTokenToString(t) !== null);

	getParseTokensSorted(parseTokens, treeRoot);
	const tokenIndexes = getTokenIndexes(parseTokens, originalCode);
	const result = new StringBuffer(undefined, true);
	let tokenIndex = 0;
	for (let i = 0; i < originalCode.length; i++) {
		const c = originalCode.charAt(i);
		if (whitespaceExpr.test(c))
			result.append(c);
		else {
			i = indexOfNextNonParsableCharacter(originalCode, i, parseTokens[tokenIndex]);
			if (i === -1)
				break;
			while (tokenIndex < parseTokens.length &&
			tokenIndexes.get(parseTokens[tokenIndex]) < i) {
				const token = parseTokens[tokenIndex];
				if (isSpaceImportantForTokenPair(parseTokens[tokenIndex - 1], token))
					result.append(' ');

				appendWithLineBreaks(result, token);
				tokenIndex++;
			}
		}
	}
	// loop through tokens corresponding with non-whitespace text trailing at the end of the code.
	while (tokenIndex < parseTokens.length) {
		if (isSpaceImportantForTokenPair(parseTokens[tokenIndex - 1], parseTokens[tokenIndex]))
			result.append(' ');
		const token = parseTokens[tokenIndex];
		appendWithLineBreaks(result, token);
		tokenIndex++;
	}
	return result.toString();
}

export function parseTreeToCode(treeRoot, originalCode) {
	if (!(treeRoot instanceof ParseTreeToken))
		throw new Error(`treeRoot must be a ParseTreeToken but found ${treeRoot}`);
	if (typeof originalCode !== 'string')
		throw new Error(`originalCode must be a string but given ${originalCode}`);

	return processChangedTokens(treeRoot, originalCode);
};