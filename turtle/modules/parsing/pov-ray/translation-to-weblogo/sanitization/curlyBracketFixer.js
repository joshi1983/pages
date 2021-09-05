import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getSortedLastDescendentTokenOf } from
'../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { insertColIndexSpanAt } from
'../../../generic-parsing-utilities/insertColIndexSpanAt.js';
import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.children.length === 0)
		return false;
	const lastChild = token.children[token.children.length - 1];
	if (lastChild.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
		return true;
	return false;
}

export function curlyBracketFixer(root) {
	const curlyBracketExpressions = getDescendentsOfType(root, ParseTreeTokenType.CURLY_BRACKET_EXPRESSION).
		filter(isOfInterest);
	curlyBracketExpressions.forEach(function(e) {
		const lastDescendentToken = getSortedLastDescendentTokenOf(e);
		const trailingBracket = new ParseTreeToken('}',
			lastDescendentToken.lineIndex, lastDescendentToken.colIndex + 1, ParseTreeTokenType.CURLY_RIGHT_BRACKET);
		insertColIndexSpanAt(lastDescendentToken, 1);
		e.appendChild(trailingBracket);
	});
};