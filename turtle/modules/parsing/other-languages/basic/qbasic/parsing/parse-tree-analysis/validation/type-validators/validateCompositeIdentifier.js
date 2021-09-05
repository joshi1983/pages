import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodChildTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
]);
const goodParentTypes = new Set([
	ParseTreeTokenType.FUNCTION_CALL
]);

export function validateCompositeIdentifier(token, parseLogger) {
	const children = token.children;
	if (children.length < 2) {
		parseLogger.error(`Expected a COMPOSITE_IDENTIFIER to have at least 2 children but found ${children.length}`, token);
	}
	else {
		for (const child of children) {
			if (!goodChildTypes.has(child.type))
				parseLogger.error(`Expected a COMPOSITE_IDENTIIFIER to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
		}
	}
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type)) {
		parseLogger.error(`The parent type of a COMPOSITE_IDENTIFIER is not expected to be a ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
};