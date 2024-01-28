import { getAllDescendentsAsArray } from '../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getParseTokensSorted } from '../../../../../parsing/parse-tree-token/getParseTokensSorted.js';

export function shiftTokensToStartAt(startLocation, tokensRoot) {
	const tokens = getAllDescendentsAsArray(tokensRoot);
	tokens.push(tokensRoot);
	getParseTokensSorted(tokens);
	let prev;
	let lineIndex = startLocation.lineIndex;
	let colIndex = startLocation.colIndex;
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (prev !== undefined) {
			if (token.lineIndex !== prev.lineIndex) {
				lineIndex += token.lineIndex - prev.lineIndex;
				colIndex = 0;
			}
			colIndex = Math.max(0, colIndex + token.colIndex - prev.colIndex);
		}
		prev = {'lineIndex': token.lineIndex, 'colIndex': token.colIndex};
		token.lineIndex = lineIndex;
		token.colIndex = colIndex;
	}
};