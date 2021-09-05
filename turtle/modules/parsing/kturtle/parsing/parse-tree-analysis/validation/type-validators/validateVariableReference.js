import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badParentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.LEARN,
	ParseTreeTokenType.TREE_ROOT
]);

export function validateVariableReference(token, parseLogger) {
	if (badParentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected a VARIABLE_REFERENCE's parentNode.type to not be ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};