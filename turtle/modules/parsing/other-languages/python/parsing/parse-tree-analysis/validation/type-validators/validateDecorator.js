import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.FUNCTION_DEFINITION
]);

export function validateDecorator(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`A DECORATOR should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length === 1) {
		const child = children[0];
		if (child.type !== ParseTreeTokenType.ARGUMENT_LIST)
			parseLogger.error(`A DECORATOR's child should not be of type ${ParseTreeTokenType.getNameFor(child.type)}.  It should be an ARGUMENT_LIST.`, token);
	}
};