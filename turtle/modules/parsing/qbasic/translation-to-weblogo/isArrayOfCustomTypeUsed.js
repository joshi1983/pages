import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function isTypeOfInterest(token) {
	const nameToken = token.children[0];
	if (nameToken === undefined)
		return false;
	return nameToken.type === ParseTreeTokenType.IDENTIFIER;
}

function isIdentifierOfInterest(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DATA_TYPE) {
		const gParent = parent.parentNode;
		if (gParent.type === ParseTreeTokenType.AS) {
			const prev = gParent.getPreviousSibling();
			if (prev !== null) {
				if (prev.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
				prev.type === ParseTreeTokenType.TUPLE_LITERAL)
					return true;
			}
		}
	}
	return false;
}

export function isArrayOfCustomTypeUsed(root) {
	const customTypeNames = new Set(getDescendentsOfType(root,
		ParseTreeTokenType.TYPE).filter(isTypeOfInterest).
		map(t => t.children[0].val.toLowerCase()));
	return getDescendentsOfType(root,
		ParseTreeTokenType.IDENTIFIER).
		some(t => customTypeNames.has(t.val.toLowerCase()) &&
			isIdentifierOfInterest(t));
};