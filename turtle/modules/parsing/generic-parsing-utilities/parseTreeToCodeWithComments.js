import { flatten } from './flatten.js';
import { getParseTokensSorted } from '../parse-tree-token/getParseTokensSorted.js';
import { StringBuffer } from '../../StringBuffer.js';
import { indexOfWhitespace } from '../../components/code-editor/format/whitespaceUtils.js';
const whitespaceExpr = /\s/;

function indexOfNextNonParsableCharacter(s, startIndex, currentParseToken) {
	const index = indexOfWhitespace(s, startIndex);
	const colonIndex = s.indexOf(';', startIndex);
	if (index === -1)
		return colonIndex;
	if (colonIndex === -1)
		return index;
	return Math.min(index, colonIndex);
}

function processChangedTokens(treeRoot, originalCode, mightNeedSpaceBetweenTokens,
singleTokenToString, isSpaceImportantForTokenPair, getTokenIndexes) {
	// Filter new lines out because they're in the originalCode anyway.
	let parseTokens = flatten(treeRoot).filter(t => singleTokenToString(t) !== null);

	getParseTokensSorted(parseTokens, treeRoot);
	const tokenIndexes = getTokenIndexes(parseTokens, originalCode);
	const result = new StringBuffer();
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
				result.append(singleTokenToString(token));
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
		result.append(singleTokenToString(parseTokens[tokenIndex]));
		mayNeedSpace = mightNeedSpaceBetweenTokens(parseTokens[tokenIndex], parseTokens[tokenIndex + 1]);
		tokenIndex++;
	}
	return result.toString();
}

export function parseTreeToCodeWithComments(treeRoot, originalCode, mightNeedSpaceBetweenTokens,
singleTokenToString, isSpaceImportantForTokenPair, getTokenIndexes) {
	if (typeof treeRoot !== 'object' || treeRoot === null ||
	!Number.isInteger(treeRoot.lineIndex) || !Number.isInteger(treeRoot.colIndex))
		throw new Error(`treeRoot must be a ParseTreeToken but got ${treeRoot}`);
	if (typeof originalCode !== 'string')
		throw new Error('originalCode must be a string');
	if (typeof mightNeedSpaceBetweenTokens !== 'function')
		throw new Error(`mightNeedSpaceBetweenTokens must be a function but got ${mightNeedSpaceBetweenTokens}`);
	if (typeof singleTokenToString !== 'function')
		throw new Error(`singleTokenToString must be a function but got ${singleTokenToString}`);
	if (typeof isSpaceImportantForTokenPair !== 'function')
		throw new Error(`isSpaceImportantForTokenPair must be a function but got ${isSpaceImportantForTokenPair}`);
	if (typeof getTokenIndexes !== 'function')
		throw new Error(`getTokenIndexes must be a function but got ${getTokenIndexes}`);

	return processChangedTokens(treeRoot, originalCode,
		mightNeedSpaceBetweenTokens, singleTokenToString, isSpaceImportantForTokenPair, getTokenIndexes);
};