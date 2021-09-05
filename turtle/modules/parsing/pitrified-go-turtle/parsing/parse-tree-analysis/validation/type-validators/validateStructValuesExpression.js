import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badChildTypes = new Set([
	ParseTreeTokenType.COMMA_EXPRESSION
]);

export function validateStructValuesExpression(token, parseLogger) {
	const children = token.children;
	if (children.length < 2)
		parseLogger.error(`STRUCT_VALUES_EXPRESSION should have at least 2 children but found ${children.length}`, token);
	else {
		for (const child of children) {
			if (badChildTypes.has(child.type))
				parseLogger.error(`A STRUCT_VALUES_EXPRESSION is not expected to have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
		}
	}
};