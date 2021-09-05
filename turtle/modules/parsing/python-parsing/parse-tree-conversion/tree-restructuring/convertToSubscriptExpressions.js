import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const restrictedParentTypes = new Set([
ParseTreeTokenType.ASSIGNMENT_OPERATOR,
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.IDENTIFIER,
ParseTreeTokenType.TREE_ROOT,
ParseTreeTokenType.UNARY_OPERATOR
]);

function createParentNode(token) {
	const result = new ParseTreeToken(null, token.lineIndex, token.colIndex, ParseTreeTokenType.SUBSCRIPT_EXPRESSION);
	return result;
}

export function convertToSubscriptExpressions(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.SUBSCRIPT &&
	token.parentNode !== null &&
	token.parentNode.type !== ParseTreeTokenType.SUBSCRIPT_EXPRESSION &&
	token.parentNode.children.indexOf(token) !== 0
	) {
		const parent = token.parentNode;
		const index = parent.children.indexOf(token);
		if (parent.children[index - 1].type === ParseTreeTokenType.LIST_LITERAL) {
			if (restrictedParentTypes.has(parent.type)) {
				const p = createParentNode(parent);
				while (parent.children.length !== 0) {
					const child = parent.children[0];
					parent.removeChild(child);
					p.appendChild(child);
				}
				parent.appendChild(p);
			}
			else {
				parent.type = ParseTreeTokenType.SUBSCRIPT_EXPRESSION;
			}
			result = true;
		}
	}
	if (convertChildren(token, convertToSubscriptExpressions))
		result = true;

	return result;
};