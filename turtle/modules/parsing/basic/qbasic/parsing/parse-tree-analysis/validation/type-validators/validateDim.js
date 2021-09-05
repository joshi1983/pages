import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodChildTypes = new Set([
	ParseTreeTokenType.AS,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.TUPLE_LITERAL,
]);

export function validateDim(token, parseLogger) {
	const children = token.children;
	if (children.length === 0) {
		parseLogger.error(`Expected a DIM to have at least 1 child`, token);
	}
	else {
		const first = children[0];
		if (first.type !== ParseTreeTokenType.IDENTIFIER &&
		first.type !== ParseTreeTokenType.SHARED)
			parseLogger.error(`Expected a DIM to have a first child of type IDENTIFIER or SHARED but found ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		for (let i = 1; i < children.length; i++) {
			const child = children[i];
			if (!goodChildTypes.has(child.type))
				parseLogger.error(`Expected a DIM to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
		}
	}
};