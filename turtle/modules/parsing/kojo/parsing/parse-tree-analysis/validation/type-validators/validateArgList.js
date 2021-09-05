import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const argListParentTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNC_CALL
]);

export function validateArgList(token, parseLogger) {
	const parent = token.parentNode;
	if (!argListParentTypes.has(parent.type)) {
		if (parent.type === ParseTreeTokenType.FAT_ARROW) {
			if (parent.children[0] !== token)
				parseLogger.error(`Parent of an ARG_LIST can be a FAT_ARROW but ARG_LIST should be at index 0.  Instead, the ARG_LIST is at index ${parent.children.indexOf(token)}`, token);
		}
		else
			parseLogger.error(`Expected ARG_LIST to not have a parent type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
	const children = token.children;
	if (children.length !== 0) {
		const firstChild = children[0];
		if (firstChild.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			parseLogger.error(`Expected first child of ARG_LIST to be a CURVED_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
		}
		const lastChild = children[children.length - 1];
		if (firstChild === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
		lastChild.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			parseLogger.error(`Expected last child of ARG_LIST to be a CURVED_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};