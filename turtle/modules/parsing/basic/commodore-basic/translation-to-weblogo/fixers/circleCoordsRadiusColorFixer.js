import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { mightBeDataValue } from
'../../../qbasic/parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

const argTypesNotOfInterest = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL
]);

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;

	const nameToken = children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	if (nameToken.val.toLowerCase() !== 'circle')
		return false;

	const args = children[1].children.filter(mightBeDataValue);
	if (args.length !== 4)
		return false;
	if (args.some(a => argTypesNotOfInterest.has(a.type)))
		return false;
	return true;
}

function process(circleToken) {
	const argList = circleToken.children[1];
	const args = argList.children.filter(mightBeDataValue);
	const colorToken = args[0];
	const firstCommaToken = colorToken.getNextSibling();
	const xToken = args[1];
	const tupleCommaToken = xToken.getNextSibling();
	const yToken = args[2];
	const radiusToken = args[3];
	const tupleLiteral = new ParseTreeToken(null, xToken.lineIndex, xToken.colIndex, ParseTreeTokenType.TUPLE_LITERAL);
	const tupleOpenBracket = new ParseTreeToken('(', xToken.lineIndex, xToken.colIndex - 1, ParseTreeTokenType.CURVED_LEFT_BRACKET);
	const tupleCloseBracket = new ParseTreeToken(')', yToken.lineIndex, yToken.colIndex + 1, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
	tupleLiteral.appendChild(tupleOpenBracket);
	xToken.remove();
	tupleLiteral.appendChild(xToken);
	if (tupleCommaToken.type === ParseTreeTokenType.COMMA) {
		tupleCommaToken.remove();
		tupleLiteral.appendChild(tupleCommaToken);
	}
	yToken.remove();
	tupleLiteral.appendChild(yToken);
	tupleLiteral.appendChild(tupleCloseBracket);
	argList.insertAsFirstChild(tupleLiteral);

	// swap color and radius tokens.
	radiusToken.remove();
	argList.replaceChild(colorToken, radiusToken);
	argList.appendChild(colorToken);
	if (firstCommaToken.type === ParseTreeTokenType.COMMA) {
		firstCommaToken.remove();
		tupleLiteral.appendSibling(firstCommaToken);
	}
}

export function circleCoordsRadiusColorFixer(root) {
	const circleCalls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest);
	circleCalls.forEach(process);

	return circleCalls.length !== 0;
};