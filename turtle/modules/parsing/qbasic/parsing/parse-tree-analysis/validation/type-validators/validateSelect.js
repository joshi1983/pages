import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const havingChildrenParentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

export function validateSelect(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (children.length === 0) {
		if (parent.type !== ParseTreeTokenType.END_SELECT)
			parseLogger.error(`Expected parent of a childless SELECT to be END_SELECT but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
	else {
		const lastChild = children[children.length - 1];
		if (!havingChildrenParentTypes.has(parent.type))
			parseLogger.error(`When a SELECT has children, expected parent to be one of ` + 
		`${Array.from(havingChildrenParentTypes).map(t => ParseTreeTokenType.getNameFor(t.type)).join(',')} but found ${ParseTreeTokenType.getNameFor(parent.type)}.`, token);
		if (lastChild.type !== ParseTreeTokenType.END_SELECT)
			parseLogger.error(`Expected last child of a SELECT to be an END_SELECT but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
		else {
			for (let i = children.length - 2; i >= 0; i--) {
				const child = children[i];
				if (child.type === ParseTreeTokenType.END_SELECT)
					parseLogger.error(`Expected only the last child of a SELECT to be an END_SELECT but found another at child index ${i}`, token);
				else if (child.type !== ParseTreeTokenType.CASE)
					parseLogger.error(`Expected a child of type CASE but found ${ParseTreeTokenType.getNameFor(child.type)}`, token);
			}
		}
	}
};