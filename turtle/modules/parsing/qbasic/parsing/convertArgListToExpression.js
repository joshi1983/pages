import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldBecomeTupleLiteral(argList) {
	return argList.children.some(t => t.type === ParseTreeTokenType.COMMA);
}

export function convertArgListToExpression(argList) {
	let type = ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
	if (shouldBecomeTupleLiteral(argList))
		type = ParseTreeTokenType.TUPLE_LITERAL;
	const e = new ParseTreeToken(null, argList.lineIndex, argList.colIndex,
		type);
	const children = argList.children;
	while (children.length !== 0) {
		const first = children[0];
		first.remove();
		e.appendChild(first);
	}
	argList.appendChild(e);
	return e;
}