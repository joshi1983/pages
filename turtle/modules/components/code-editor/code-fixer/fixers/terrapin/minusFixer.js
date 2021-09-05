import { getNextArgToken } from
'../helpers/getNextArgToken.js';
import { getSortedNextTokenAfter } from
'../../../../../parsing/generic-parsing-utilities/getSortedNextTokenAfter.js';
import { NumberType } from
'../../../../../parsing/data-types/NumberType.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

const num = new NumberType();

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'minus')
		return false;

	const next = getNextArgToken(token);
	if (next === null || !num.mayBeCompatibleWith(next))
		return false;

	return true;
}

export function minusFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByTypes([ParseTreeTokenType.LEAF, ParseTreeTokenType.PARAMETERIZED_GROUP]).
		filter(isOfInterest);
	tokens.forEach(function(minusToken) {
		const oldType = minusToken.type;
		const next = getNextArgToken(minusToken);

		// Place the minusToken immediately before its next token so dumping the tree with 
		// comments puts no space between the two.
		// This is important to ensure the - is not confused with being a binary operator.
		const nextSorted = getSortedNextTokenAfter(minusToken);
		minusToken.lineIndex = nextSorted.lineIndex;
		minusToken.colIndex = nextSorted.colIndex;
		if (typeof nextSorted.val === 'string')
			minusToken.colIndex -= nextSorted.val.length;
		else
			minusToken.colIndex --;

		minusToken.type = ParseTreeTokenType.UNARY_OPERATOR;
		minusToken.val = '-';
		if (minusToken.children.length === 0) {
			next.remove();
			minusToken.appendChild(next);
			if (minusToken.type !== oldType)
				cachedParseTree.tokenTypeChanged(minusToken, oldType);
		}
		fixLogger.log(`Replaced minus command call with unary - because WebLogo does not support a minus for negation command.`, minusToken);
	});
};