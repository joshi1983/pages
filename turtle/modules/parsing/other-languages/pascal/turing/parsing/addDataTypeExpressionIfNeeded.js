import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const declarationTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.FORMAL_ARG_LIST,
	ParseTreeTokenType.FUNCTION, // for return type
	ParseTreeTokenType.VAR
]);

function shouldAddDataTypeExpression(prev, next) {
	if (!declarationTypes.has(prev.type))
		return false;

	const prevChildren = prev.children;
	if (prevChildren.length < 2)
		return false;

	const lastChild = prevChildren[prevChildren.length - 1];
	if (lastChild.type !== ParseTreeTokenType.COLON)
		return false;

	if (prevChildren.some(c => c.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION))
		return false;

	return true;
}

export function addDataTypeExpressionIfNeeded(prev, next) {
	if (shouldAddDataTypeExpression(prev, next)) {
		const dte = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		prev.appendChild(dte);
		return dte;
	}
	return prev;
};