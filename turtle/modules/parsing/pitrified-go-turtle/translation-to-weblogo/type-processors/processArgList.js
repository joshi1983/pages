import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function getParameterName(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;
	
}

export function processArgList(token, result, settings) {
	const parent = token.parentNode;
	for (const child of filterBracketsAndCommas(token.children)) {
		if (parent.type === ParseTreeTokenType.FUNC) {
			const name = getParameterName(child);
			result.append(':' + name);
		}
		else {
			processToken(child, result, settings);
		}
		result.append(' ');
	}
};