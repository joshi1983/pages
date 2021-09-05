import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const defParentTypes = new Set([
	ParseTreeTokenType.CLASS_OBJECT_BODY,
	ParseTreeTokenType.FINAL,
	ParseTreeTokenType.OVERRIDE,
	ParseTreeTokenType.PROTECTED,
	ParseTreeTokenType.TREE_ROOT
]);

export function validateDef(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (!defParentTypes.has(parent.type))
		parseLogger.error(`A DEF should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);

	const lastChild = children[children.length - 1];
	if (lastChild !== undefined) {
		if (lastChild.type !== ParseTreeTokenType.CODE_BLOCK &&
		lastChild.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		parent.type === ParseTreeTokenType.TREE_ROOT)
			parseLogger.error(`The last child of a DEF should usually be a CODE_BLOCK or ASSIGNMENT_OPERATOR but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};