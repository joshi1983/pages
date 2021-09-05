import { getDescendentsOfTypes } from
'../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { getSortedLastDescendentTokenOf } from '../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';

const useNextAlwaysTypes = new Set([
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);
const valueTokenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.PARAMETERIZED_GROUP,
	ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.VECTOR_EXPRESSION
]);
SetUtils.addAll(valueTokenTypes, useNextAlwaysTypes);

function isOfInterest(token) {
	if (token.children.length === 0)
		return false;
	const firstChild = token.children[0];
	if (firstChild.type === ParseTreeTokenType.BINARY_OPERATOR &&
	firstChild.val === '=')
		return false;
	const valueToken = getNextValToken(token);
	if (valueToken === null)
		return false;
	return valueTokenTypes.has(valueToken.type);
}

function getNextValToken(declare) {
	const next = declare.getNextSibling();
	if (next !== null && useNextAlwaysTypes.has(next.type))
		return next;
	const firstChild = declare.children[0];
	if (firstChild.type === ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION) {
		return firstChild.children[1];
	}
	return next;
}

export function declareMissingEqualFixer(root) {
	const declares = getDescendentsOfTypes(root, [ParseTreeTokenType.DECLARE, ParseTreeTokenType.LOCAL]).
		filter(isOfInterest);
	declares.forEach(function(declare) {
		const firstChild = declare.children[0];
		const nextValToken = getNextValToken(declare);
		if (nextValToken.type === ParseTreeTokenType.ARG_LIST)
			nextValToken.type = ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
		nextValToken.remove();
		const firstChildLocation = getSortedLastDescendentTokenOf(firstChild);
		const equal = new ParseTreeToken('=', firstChildLocation.lineIndex, firstChildLocation.colIndex + 1, ParseTreeTokenType.BINARY_OPERATOR);
		firstChild.remove();
		equal.appendChild(firstChild);
		equal.appendChild(nextValToken);
		declare.appendChild(equal);
	});
};