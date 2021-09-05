import { getParseTokensSorted } from './parse-tree-token/getParseTokensSorted.js';
import { mightNeedSpaceBetweenTokens } from './parse-tree-token/mightNeedSpaceBetweenTokens.js';
import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { StringBuffer } from '../StringBuffer.js';
import { StringUtils } from '../StringUtils.js';
import { indexOfWhitespace } from '../components/code-editor/format/whitespaceUtils.js';
const whitespaceExpr = /\s/;

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
		if (token.type === ParseTreeTokenType.LONG_STRING_LITERAL &&
		token.isComplete === false && token.val.endsWith('\n'))
			index --;
		result.set(token, index);
	});
	return result;
};

export function singleTokenToString(parseToken) {
	if (!(parseToken instanceof ParseTreeToken))
		throw new Error('parseToken must be a ParseTreeToken.  Not: ' + parseToken);
	if (parseToken.children.length === 0)
		return parseToken.toString();
	else if ([ParseTreeTokenType.LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.TREE_ROOT].indexOf(parseToken.type) !== -1)
		return null; // any brackets will be in the children tokens.
	else if ([ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.PARAMETERIZED_GROUP,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.UNARY_OPERATOR].indexOf(parseToken.type) !== -1)
		return parseToken.val; // Things like the string "to", "TO", "+", "-", "*".
	return '' + parseToken.val;
};

function indexOfNextNonParsableCharacter(s, startIndex, currentParseToken) {
	if (currentParseToken !== undefined && currentParseToken.type === ParseTreeTokenType.LONG_STRING_LITERAL) {
		if (currentParseToken.isComplete !== false) {
			const index = s.indexOf('\'', startIndex + 1);
			if (index > startIndex)
				return index + 1;
		}
		else {
			const index = s.indexOf(currentParseToken.val, startIndex + 1);
			if (index > startIndex)
				return index + currentParseToken.val.length;
		}
	}
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
It is important if a lack of space risks a parse or code quality error.

Improved human readability of code is not considered important enough here because
we want to fix code specifically and not reformat it.  
We don't want to change coding style if the user wants to remove unnecessary spaces.
*/
function isSpaceImportantForTokenPair(prevToken, nextToken) {
	if (prevToken.type === ParseTreeTokenType.UNARY_OPERATOR)
		return false;
	if (prevToken.isBracketOrBinaryOperator()) {
		if (prevToken.val !== '-' && prevToken.val !== '+')
			return false;
		if (nextToken.children.length === 0 &&
		prevToken.lineIndex === nextToken.lineIndex &&
		prevToken.colIndex === nextToken.colIndex - nextToken.toString().length)
			return false;
	}
	if (nextToken.isBracketOrBinaryOperator())
		return false;
	return true;
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
	let parseTokens = ParseTreeToken.flatten(treeRoot).filter(t =>
		t.type !== ParseTreeTokenType.NEW_LINE && singleTokenToString(t) !== null);

	getParseTokensSorted(parseTokens, treeRoot);
	const tokenIndexes = getTokenIndexes(parseTokens, originalCode);
	const result = new StringBuffer(undefined, true);
	let tokenIndex = 0;
	for (let i = 0; i < originalCode.length; i++) {
		const c = originalCode.charAt(i);
		if (c === ';') {
			const index = originalCode.indexOf('\n', i);
			if (index === -1) {
				result.append(originalCode.substring(i));
				break;
			}
			else {
				result.append(originalCode.substring(i, index));
				i = index - 1;
			}
		}
		else if (whitespaceExpr.test(c))
			result.append(c);
		else {
			i = indexOfNextNonParsableCharacter(originalCode, i, parseTokens[tokenIndex]);
			if (i === -1)
				break;
			let mayNeedSpace = false;
			while (tokenIndex < parseTokens.length && tokenIndexes.get(parseTokens[tokenIndex]) < i) {
				const token = parseTokens[tokenIndex];
				if (mayNeedSpace && isSpaceImportantForTokenPair(parseTokens[tokenIndex - 1], token))
					result.append(' ');

				appendWithLineBreaks(result, token);
				mayNeedSpace = mightNeedSpaceBetweenTokens(parseTokens[tokenIndex], parseTokens[tokenIndex + 1]);
				tokenIndex++;
			}
			i--;
		}
	}
	// loop through tokens corresponding with non-whitespace text trailing at the end of the code.
	let mayNeedSpace = false;
	while (tokenIndex < parseTokens.length) {
		if (mayNeedSpace && isSpaceImportantForTokenPair(parseTokens[tokenIndex - 1], parseTokens[tokenIndex]))
			result.append(' ');
		const token = parseTokens[tokenIndex];
		appendWithLineBreaks(result, token);
		mayNeedSpace = mightNeedSpaceBetweenTokens(token, parseTokens[tokenIndex + 1]);
		tokenIndex++;
	}
	return result.toString();
}

export function parseTreeToCodeWithComments(treeRoot, originalCode) {
	if (!(treeRoot instanceof ParseTreeToken))
		throw new Error('treeRoot must be a ParseTreeToken');
	if (typeof originalCode !== 'string')
		throw new Error('originalCode must be a string');

	return processChangedTokens(treeRoot, originalCode);
};