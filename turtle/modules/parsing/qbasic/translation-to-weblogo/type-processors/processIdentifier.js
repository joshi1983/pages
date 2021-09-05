import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const variableReadParentTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.STEP,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR,
]);

function isVariableRead(token) {
	const parent = token.parentNode;
	if (variableReadParentTypes.has(parent.type))
		return true;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT) {
		if (parent.children.indexOf(token) === 1)
			return true;
	}
	return false;
}

export function processIdentifier(token, result, options) {
	const webLogoIdentifier = options.identifierRenameMap.get(token.val.toLowerCase());
	if (isVariableRead(token))
		result.append(':' + webLogoIdentifier);
	else
		result.append(webLogoIdentifier);
};