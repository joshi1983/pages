import { input } from './input.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function read(token, result, options) {
	const argList = token.children[1];
	if (argList === undefined)
		return; // parse tree is messed up.  
		// Give up translating this instead of throwing exception.

	const readProcName = options.readProcName;
	if (readProcName === undefined) {
		input(token, result, options);
		return;
	}
	result.append('\n');
	for (const child of argList.children) {
		if (child.type === ParseTreeTokenType.IDENTIFIER) {
			result.append(`make "${options.identifierRenameMap.get(child.val.toLowerCase())} ${readProcName}\n`);
		}
	}
};