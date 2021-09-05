import { addFunctionDefinitionArgListBrackets } from './addFunctionDefinitionArgListBrackets.js';
import { isSingleLineComment } from '../isSingleLineComment.js';
import { removeUnusedIndents } from './removeUnusedIndents.js';
import { sanitizeColons } from './sanitizeColons.js';
import { splitMinusOperator } from './splitMinusOperator.js';

const sanitizers = [
	addFunctionDefinitionArgListBrackets,
	removeUnusedIndents,
	sanitizeColons,
	splitMinusOperator
];

export function runAllSanitizers(scanTokens) {
	// remove the obvious comments.
	const comments = scanTokens.filter(token => isSingleLineComment(token.s));
	const filteredTokens = scanTokens.filter(token => !isSingleLineComment(token.s));
	
	// run the sanitizers on tokens that do not include obvious comments.
	// Dealing with the comments is more complex than without so we process these without comments.
	for (const sanitize of sanitizers)
		sanitize(filteredTokens);

	// Now, add the comments back in.
	let result;
	if (comments.length !== 0) {
		// insert the comments back in.
		let commentIndex = 0;
		let i = 0;
		let resultIndex = 0;
		result = [];
		while (i < filteredTokens.length && commentIndex < comments.length) {
			if (filteredTokens[i].lineIndex > comments[commentIndex].lineIndex)
				result[resultIndex] = comments[commentIndex++];
			else
				result[resultIndex] = filteredTokens[i++];
			resultIndex++;
		}
		for (;commentIndex < comments.length; commentIndex++)
			result.push(comments[commentIndex]);
		for (;i < filteredTokens.length; i++)
			result.push(filteredTokens[i]);
	}
	else
		result = filteredTokens;

	for (let i = 0; i < result.length; i++) {
		scanTokens[i] = result[i];
	}
	scanTokens.length = result.length;
};