import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FOR_EACH
]);

export function validateNext(token, parseLogger) {
	const children = token.children;
	if (children.length !== 0 && children.length % 2 !== 1)
		parseLogger.error(`Expected a NEXT to have either 0 children or an odd number of them but found ${children.length}`, token);
	const parent = token.parentNode;
	if (!parentTypes.has(parent.type))
		parseLogger.error(`Expected parent of NEXT to be of type FOR or FOR_EACH but found parent with type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);

	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (i % 2 === 0) {
			if (child.type !== ParseTreeTokenType.IDENTIFIER)
				parseLogger.error(`Expected a NEXT to have a child of type IDENTIFIER at any even child index but found ${ParseTreeTokenType.getNameFor(child.type)} at index ${i}`, child);
		}
		else {
			if (child.type !== ParseTreeTokenType.COMMA)
				parseLogger.error(`Expected a NEXT to have a child of type COMMA at any odd child index but found ${ParseTreeTokenType.getNameFor(child.type)} at index ${i}`, child);
		}
	}
};