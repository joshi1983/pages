import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';
import { tokenToCommandInfo } from
'./tokenToCommandInfo.js';

export function isSetPropertyCallOnIdentifier(token) {
	const info = tokenToCommandInfo(token);
	if (info === undefined)
		return false;
	if (info.primaryName !== 'setProperty')
		return false;
	const argList = token.children[1];
	const mapToken = argList.children[1];
	if (mapToken.type !== ParseTreeTokenType.IDENTIFIER || mapToken.children.length !== 0)
		return false;
	return true;
};