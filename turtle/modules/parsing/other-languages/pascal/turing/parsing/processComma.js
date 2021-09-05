import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const previousTypesForCommaList = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.VAR
]);

function shouldCreateCommaList(prev) {
	if (!previousTypesForCommaList.has(prev.type))
		return false;
	if (prev.children.some(t => t.type === ParseTreeTokenType.COMMA_LIST))
		return false;

	return true;
}

export function processComma(prev, next) {
	if (shouldCreateCommaList(prev)) {
		const cl = new ParseTreeToken(null, prev.lineIndex, prev.colIndex,
		ParseTreeTokenType.COMMA_LIST);
		const prevChildren = prev.children;
		if (prevChildren.length !== 0) {
			const lastChild = prevChildren[prevChildren.length - 1];
			if (lastChild.type === ParseTreeTokenType.IDENTIFIER) {
				lastChild.remove();
				cl.appendChild(lastChild);
			}
		}
		cl.appendChild(next);
		prev.appendChild(cl);
		return cl;
	}
	prev.appendChild(next);
	return prev;
};