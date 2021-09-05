import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
]);

export function processDeclaration(token, result, settings) {
	const children = token.children;
	for (let i = 1; i < children.length; i++) {
		const child = children[i];
		if (!ignoredTypes.has(child.type))
			processToken(child, result, settings);
	}
};