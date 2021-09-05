import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const dontAddNextSiblingTypes = new Set([
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.TREE_ROOT
]);

export function isDontAddNextSiblingType(type) {
	return dontAddNextSiblingTypes.has(type);
}