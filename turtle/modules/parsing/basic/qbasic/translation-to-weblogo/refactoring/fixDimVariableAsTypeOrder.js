import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.SHARED
]);

function isVariableDeclarationOfInterest(token) {
	if (token.type !== ParseTreeTokenType.AS)
		return false;
	const parent = token.parentNode;
	if (!parentTypes.has(parent.type))
		return false;
	const next = token.getNextSibling();
	if (next === null || next.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const prev = token.getPreviousSibling();
	if (prev !== null && prev.type === ParseTreeTokenType.IDENTIFIER)
		return false;
	return true;
}

export function fixDimVariableAsTypeOrder(root) {
	const ases = getDescendentsOfType(root, ParseTreeTokenType.AS).filter(isVariableDeclarationOfInterest);
	ases.forEach(function(asToken) {
		const parent = asToken.parentNode;
		const identifier = asToken.getNextSibling();
		asToken.remove();
		if (parent.type === ParseTreeTokenType.SHARED)
			identifier.appendChild(asToken);
		else
			identifier.appendSibling(asToken);
	});
	return ases.length !== 0;
}