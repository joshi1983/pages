import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isGlobalIdentifier(token, lookAheadToken) {
	if (token.type === ParseTreeTokenType.COMMA)
		return true;
	if (token.type === ParseTreeTokenType.IDENTIFIER && (lookAheadToken === undefined ||
	lookAheadToken.type === ParseTreeTokenType.COMMA))
		return true;
	return false;
}

export function convertGlobalStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.UNRECOGNIZED &&
	token.children.length > 0) {
		for (let i = 0; i < token.children.length; i++) {
			const child = token.children[i];
			if (child.type === ParseTreeTokenType.GLOBAL) {
				while (i < token.children.length - 1 &&
				isGlobalIdentifier(token.children[i + 1], token.children[i + 2])) {
					child.appendChild(token.children[i + 1]);
					result = true;
				}
			}
		}
	}
	if (convertChildren(token, convertGlobalStructures))
		result = true;
	return result;
};