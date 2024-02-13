import { CachedParseTree } from '../../../parsing/parse-tree-analysis/CachedParseTree.js';
import { getTokenAtPositionInTree } from './getTokenAtPositionInTree.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
import { VariableNameSuggestions } from './VariableNameSuggestions.js';

const suggestionClasses = [
	VariableNameSuggestions
];

function isApplicable(token) {
	for (let i = 0; i < suggestionClasses.length; i++) {
		const suggestionsClass = suggestionClasses[i];
		if (suggestionsClass.isApplicableToToken(token)) {
			return true;
		}
	}
	return false;
}

export function getSuggestions(proceduresMap, tree, position, initialVariables) {
	if (!(proceduresMap instanceof Map))
		throw new Error(`proceduresMap must be a Map. Not: ${proceduresMap}`);
	if (typeof position !== 'object')
		throw new Error(`position must be an object.  Not: ${position}`);
	if (!(initialVariables instanceof Map))
		throw new Error(`initialVariables must be a Map. Not: ${initialVariables}`);
	const cachedParseTree = new CachedParseTree(tree, proceduresMap, initialVariables);
	const allTokens = cachedParseTree.getAllTokens();
	let token = getTokenAtPositionInTree(allTokens.filter(isApplicable), position);
	if (token !== undefined) {
		for (let i = 0; i < suggestionClasses.length; i++) {
			const suggestionsClass = suggestionClasses[i];
			if (suggestionsClass.isApplicableToToken(token)) {
				const suggestionsResult = suggestionsClass.getSuggestions(cachedParseTree, token, position);
				if (suggestionsResult.length > 0)
					return {
						'strings': suggestionsResult,
						'token': token,
						'typedIndex': token.colIndex - position.colIndex + token.val.length
					};
			}
		}
	}
	return {'strings': [], 'token': undefined, 'typedIndex': 0};
};