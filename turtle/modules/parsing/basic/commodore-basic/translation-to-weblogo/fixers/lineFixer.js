import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

function isAlreadyProcessedArgList(argList) {
	const children = argList.children;
	if (argList.type !== ParseTreeTokenType.ARG_LIST ||
	children.length === 0 || children.length > 3)
		return false;
	const firstChild = children[0];
	if (firstChild.val === '-')
		return true;
	if (children.length > 1) {
		if (children[1].val !== ',')
			return false;
	}
	return true;
}

function isOfInterest(token) {
	const nameToken = token.children[0];
	if (nameToken === undefined)
		return false;
	if (nameToken.val.toLowerCase() !== 'line')
		return false;
	if (isAlreadyProcessedArgList(token.children[1]))
		return false;
	return true;
}

export function lineFixer(root) {
	if (typeof root !== 'object')
		throw new Error(`root must be an object but found ${root}`);
	if (!(root.children instanceof Array))
		throw new Error(`root.children must be an Array but found ${root.children}`);

	const lines = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest);
	lines.forEach(function(token) {
		const argList = token.children[1];
		const argListChildren = argList.children;
		const y1Token = argListChildren[2];
		const commaToken = argListChildren[3];
		const y2Token = argListChildren[6];
		const openCurve1 = new ParseTreeToken('(', 
			argList.lineIndex, argList.colIndex, ParseTreeTokenType.CURVED_LEFT_BRACKET);
		const closeCurve1 = new ParseTreeToken(')', 
			y1Token.lineIndex, y1Token.colIndex + 1, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
		const point1Token = new ParseTreeToken(null, 
			argList.lineIndex, argList.colIndex, ParseTreeTokenType.TUPLE_LITERAL);
		point1Token.appendChild(openCurve1);
		for (let i = 0; i < 3; i++) {
			const t = argList.children[0];
			t.remove();
			point1Token.appendChild(t);
		}
		point1Token.appendChild(closeCurve1);
		const point2Token = new ParseTreeToken(null, 
			commaToken.lineIndex, commaToken.colIndex + 1,
			ParseTreeTokenType.TUPLE_LITERAL);
		const openCurve2 = new ParseTreeToken('(', 
			commaToken.lineIndex, commaToken.colIndex + 1, ParseTreeTokenType.CURVED_LEFT_BRACKET);
		const closeCurve2 = new ParseTreeToken(')', 
			y2Token.lineIndex, y2Token.colIndex + 1, ParseTreeTokenType.CURVED_RIGHT_BRACKET);

		commaToken.val = '-';
		commaToken.type = ParseTreeTokenType.BINARY_OPERATOR;
		point2Token.appendChild(openCurve2);
		for (let i = 0; i < 3; i++) {
			const t = argList.children[1];
			t.remove();
			point2Token.appendChild(t);
		}
		point2Token.appendChild(closeCurve2);

		commaToken.appendChild(point1Token);
		commaToken.appendChild(point2Token);
	});
	return lines.length !== 0;
};