import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { getTokenValue } from
'../../parse-tree-analysis/variable-data-types/evaluators/getTokenValue.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processColorStringLiteral } from './processColorStringLiteral.js';
import { processToken } from './processToken.js';

export function isAllZeros(token) {
	if (token.type === ParseTreeTokenType.LIST_LITERAL ||
	token.type === ParseTreeTokenType.TUPLE_LITERAL) {
		const valueTokens = filterBracketsAndCommas(token.children);
		if (valueTokens.length === 3) {
			for (const child of valueTokens) {
				const val = getTokenValue(child);
				if (val !== 0)
					return false;
			}
			return true;
		}
	}
	return false;
};

export function processColorValueToken(colourValueToken, result, cachedParseTree, settings) {
	if (colourValueToken.type === ParseTreeTokenType.STRING_LITERAL)
		processColorStringLiteral(colourValueToken, result);
	else if (isAllZeros(colourValueToken))
		result.append('"black');
	else {
		processToken(colourValueToken, result, cachedParseTree, settings);
	}
};