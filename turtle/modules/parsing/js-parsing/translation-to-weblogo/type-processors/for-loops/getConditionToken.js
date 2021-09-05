import { ArrayUtils } from '../../../../../ArrayUtils.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function getConditionToken(token) {
	if (token.children.length !== 0) {
		const settings = token.children[0];
		// should be at index 2 but we'll scan for a little better handling of unusual parse trees.
		const semicolonIndex = ArrayUtils.indexOfMatch(settings.children, (t) => t.type === ParseTreeTokenType.SEMICOLON);
		if (semicolonIndex !== -1) {
			return settings.children[semicolonIndex + 1];
		}
	}
}