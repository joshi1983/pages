import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../../parsing/js-parsing/ParseTreeTokenType.js';

export function getInitialSettings(root) {
	const idTokens = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER);
	const identifiers = new Set(idTokens.map(t => t.val.toLowerCase()));
	return {
		'identifiersSet': identifiers
	};
};