import { ForLoops } from
'../../ForLoops.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getRequiredTypesForForSettingsToken(token) {
	const parentToken = token.parentNode;
	if (parentToken === null)
		return;
	if (parentToken.type === ParseTreeTokenType.LIST) {
		const grandParent = parentToken.parentNode;
		if (grandParent !== null && !token.isBracket() && ForLoops.isAForLoopToken(grandParent)) {
			const index = parentToken.children.indexOf(token);
			if (index > 1)
				return 'num';
		}
	}
}