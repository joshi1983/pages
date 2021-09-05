import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from './helpers/processTokens.js';

export function processArrayLiteral(token, result, settings) {
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.ARRAY_VALUES_BLOCK) {
		result.append(' [ ');
		processTokens(filterBracketsAndCommas(lastChild.children), result, settings);
		result.append(' ] ');
	}
};