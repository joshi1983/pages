import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const validChildTypes = new Set([
	ParseTreeTokenType.ARROW,
	ParseTreeTokenType.ASSIGNMENT
]);

export function validateTreeRoot(token, parseLogger) {
	for (const child of token.children) {
		if (!validChildTypes.has(child.type))
			parseLogger.error(`Type ${ParseTreeTokenType.getNameFor(child.type)} should not be a direct child of a TREE_ROOT.`, child);
	}
};