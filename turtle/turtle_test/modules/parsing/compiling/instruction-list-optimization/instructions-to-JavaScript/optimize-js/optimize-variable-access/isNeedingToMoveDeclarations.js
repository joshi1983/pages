import { getClosestOfType } from '../../../../../generic-parsing-utilities/getClosestOfType.js';
import { isAfterOrSame } from '../../../../../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

function isTopLevelInstruction(token) {
	const codeBlock = getClosestOfType(token, ParseTreeTokenType.CODE_BLOCK);
	if (codeBlock === null)
		return true;
	return false;
}

export function isNeedingToMoveDeclarations(variables) {
	for (const info of variables.values()) {
		// remove any assignment tokens after the very first one.
		const firstAssignToken = info.getFirstAssignToken();
		if (firstAssignToken === undefined)
			return true;
		if (!isTopLevelInstruction(firstAssignToken)) {
			return true;
		}
		for (const readToken of info.readTokens) {
			if (isAfterOrSame(firstAssignToken, readToken)) {
				return true;
			}
		}
	}
	return false;
};