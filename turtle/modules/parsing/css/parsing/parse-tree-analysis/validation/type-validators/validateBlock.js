import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateBlock(token, parseLogger) {
	const children = token.children;
	const typeName = ParseTreeTokenType.getNameFor(token.type);
	if (children.length < 2)
		parseLogger.error(`At least 2 children expected for ${typeName} but only ${children.length} found`, token);
	else {
		if (children[0].type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
			parseLogger.error(`First child of ${typeName} expected to be CURLY_LEFT_BRACKET for ${typeName} but found ${ParseTreeTokenType.getNameFor(children[0].type)} found`, token);
		const lastChild = children[children.length - 1];
		if (lastChild.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
			parseLogger.error(`Last child of ${typeName} expected to be CURLY_RIGHT_BRACKET for ${typeName} but found ${ParseTreeTokenType.getNameFor(lastChild.type)} found`, token);
	}
};