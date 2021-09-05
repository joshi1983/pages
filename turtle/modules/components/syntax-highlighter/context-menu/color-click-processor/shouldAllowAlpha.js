import { Command } from
'../../../../parsing/Command.js';
import { elementToToken } from '../convert-to-asset/elementToToken.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function isParentOfInterest(token) {
	return true;
}

export function shouldAllowAlpha(element, tree) {
	const token = elementToToken(element, tree, isParentOfInterest);
	if (token === undefined)
		return true;
	const parent = token.parentNode;
	if (parent !== null &&
	parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(parent.val);
		if (info !== undefined) {
			const parameterIndex = parent.children.indexOf(token);
			const argInfo = Command.getParameterInfo(info, parameterIndex);
			if (argInfo !== undefined) {
				if (argInfo.types.indexOf('color') !== -1 &&
				argInfo.types.indexOf('alphacolor') === -1)
					return false;
			}
		}
	}
	return true;
};