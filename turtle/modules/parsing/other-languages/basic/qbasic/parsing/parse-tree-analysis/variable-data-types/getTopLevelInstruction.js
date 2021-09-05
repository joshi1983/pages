import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const blockTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

export function getTopLevelInstruction(token) {
	if (blockTypes.has(token.type))
		return token;
	while (true) {
		const parent = token.parentNode;
		if (blockTypes.has(parent.type))
			return token;

		token = parent;
	}
}