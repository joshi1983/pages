import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../../processToken.js';

const typesToSkip = new Set([
ParseTreeTokenType.COLON,
ParseTreeTokenType.SQUARE_LEFT_BRACKET,
ParseTreeTokenType.SQUARE_RIGHT_BRACKET
]);

function getBestDescendentToken(token) {
	if (token.type === ParseTreeTokenType.SUBSCRIPT && token.children.length >= 2)
		token = token.children[1];
	if (token.type === ParseTreeTokenType.UNRECOGNIZED) {
		let result;
		const children = token.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (!typesToSkip.has(child.type)) {
				if (result !== undefined) {
					result = undefined;
					break;
				}
				result = child;
			}
		}
		if (result !== undefined)
			return result;
	}
	return token;
}

export function processIndex(token, result, cachedParseTree) {
	const indexToken = getBestDescendentToken(token);
	if (indexToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		const tokenValues = cachedParseTree.getTokenValues();
		const val = tokenValues.get(indexToken);
		if (val !== undefined) {
			result.append(`${val + 1} `);
			return;
		}
	}
	result.append('1 + ');
	processToken(indexToken, result, cachedParseTree);
	result.append(' ');
};