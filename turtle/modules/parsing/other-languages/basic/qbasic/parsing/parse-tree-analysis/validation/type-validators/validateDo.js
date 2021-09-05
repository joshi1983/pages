import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const lastChildTypes = new Set([
	ParseTreeTokenType.LOOP_WHILE,
	ParseTreeTokenType.LOOP
]);

const parentTypesIndicating0Children = new Set([
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE,
	ParseTreeTokenType.EXIT
]);

export function validateDo(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (parentTypesIndicating0Children.has(parent.type)) {
		if (children.length !== 0)
			parseLogger.error(`A DO in a ${ParseTreeTokenType.getNameFor(parent.type)} should have no children but found ${children.length} children.`, token);
	}
	else if (children.length !== 2)
		parseLogger.error(`A DO token should generally have 2 children but found ${children.length}.  Sometimes DO should have 0 children but those cases do not apply here.`, token);
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (lastChildTypes.has(child.type) && i !== children.length - 1)
			parseLogger.error(`A ${ParseTreeTokenType.getNameFor(child.type)} must be the last child in a DO.  One was found at index ${i} in a DO that has ${children.length} children.`, child);
	}
};