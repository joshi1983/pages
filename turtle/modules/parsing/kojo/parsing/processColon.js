import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const dteAncestorTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.VAL,
	ParseTreeTokenType.VAR
]);

function shouldCreateDataTypeExpression(prev) {
	if (prev.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const parent = prev.parentNode;
	if (!dteAncestorTypes.has(parent.type))
		return false;
	if (parent.type === ParseTreeTokenType.ARG_LIST) {
		const grandparent = parent.parentNode;
		if (grandparent.type === ParseTreeTokenType.FUNC_CALL)
			return false;
	}
	return true;
}

export function processColon(prev, next) {
	if (shouldCreateDataTypeExpression(prev)) {
		const dte = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		next.appendChild(dte);
		prev.appendChild(next);
		return dte;
	}
	prev.appendChild(next);
	return next;
};