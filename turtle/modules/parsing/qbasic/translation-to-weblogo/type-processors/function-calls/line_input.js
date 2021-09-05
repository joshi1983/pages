import { getMakeCommandNameForToken } from
'../helpers/getMakeCommandNameForToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function line_input(token, result, options) {
	const argList = token.children[1];
	if (argList === undefined)
		return;
	const makeCommand = getMakeCommandNameForToken(token);
	const next = token.getNextSibling();
	if (next === null)
		return;
	for (const child of argList.children) {
		if (child.type === ParseTreeTokenType.IDENTIFIER) {
			const webLogoName = options.identifierRenameMap.get(child.val.toLowerCase());
			let initValueExpression;
			initValueExpression = '\'lineOfText\'';
			result.append(` ${makeCommand} "${webLogoName} ${initValueExpression}\n`);
		}
	}
};