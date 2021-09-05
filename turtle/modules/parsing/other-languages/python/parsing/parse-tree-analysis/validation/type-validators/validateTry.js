import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

export function validateTry(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`A TRY should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	const first = children[0];
	if (first === undefined || first.val !== ':')
		parseLogger.error(`First child of a TRY should be a : but found something else.`, token);
};