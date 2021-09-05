import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function processDefinitionArgList(argList, result, options) {
	const children = argList.children.filter(t => t.type === ParseTreeTokenType.IDENTIFIER);
	for (const child of children) {
		result.append(' :' + options.identifierRenameMap.get(child.val.toLowerCase()));
	}
	result.append('\n');
};