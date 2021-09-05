import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

export function validateDocstring(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`A DOCSTRING should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	else {
		if (parent.type === ParseTreeTokenType.CODE_BLOCK) {
			const grandparent = parent.parentNode;
			if (grandparent.type !== ParseTreeTokenType.FUNCTION_DEFINITION)
				parseLogger.error(`Grandparent of a DOCSTRING within a CODE_BLOCK should be a FUNCTION_DEFINITION but found grandparent with type ${ParseTreeTokenType.getNameFor(grandparent.type)}`, token);
		}
	}
};