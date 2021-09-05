import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getSortedLastDescendentTokenOf } from 
'../../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeToken } from 
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isNeedingEndIf(token) {
	const children = token.children;
	if (children.length < 2)
		return false; // too few children for the end if to help.
	const lastChild = children[children.length - 1];
	return lastChild.type !== ParseTreeTokenType.END_IF;
}

/*
Adds "end if" to if tokens that need them.
*/
export function addEndIf(root) {
	const tokens = getDescendentsOfType(root, ParseTreeTokenType.IF).
		filter(isNeedingEndIf);
	tokens.forEach(function(token) {
		const last = getSortedLastDescendentTokenOf(token);
		const endIfToken = new ParseTreeToken(null, last.lineIndex, last.colIndex + 1, ParseTreeTokenType.END_IF);
		const endToken = new ParseTreeToken('END', last.lineIndex, last.colIndex + 1, ParseTreeTokenType.END);
		const ifToken = new ParseTreeToken('IF', last.lineIndex, last.colIndex + 2, ParseTreeTokenType.IF);
		endIfToken.appendChild(endToken);
		endIfToken.appendChild(ifToken);
		token.appendChild(endIfToken);
	});
	return tokens.length !== 0;
};