import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const childTypes = new Set([
	ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR,
	ParseTreeTokenType.GENERIC_TYPE_EXPRESSION,
	ParseTreeTokenType.INDEX_EXPRESSION
]);

export function validateDataType(token, parseLogger) {
	const children = token.children;
	for (const child of children) {
		if (!childTypes.has(child.type))
			parseLogger.error(`Expected child to be ${Array.from(childTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	}
};