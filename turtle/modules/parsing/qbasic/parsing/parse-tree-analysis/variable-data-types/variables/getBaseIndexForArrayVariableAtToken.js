import { evaluateNumberLiteral } from
'../../../../evaluation/evaluateNumberLiteral.js';
import { mightBeDataValue } from
'../mightBeDataValue.js';
import { ParseTreeToken } from
'../../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

/*

@param token should be a ParseTreeToken identifying where we want 
	to look for the specified variable declaration.
@param dimensionIndex should be an integer.  It should be 0 or greater.
*/
export function getBaseIndexForArrayVariableAtToken(variableName, token, dimensionIndex, options) {
	if (!(token instanceof ParseTreeToken))
		throw new Error(`token must be a ParseTreeToken but found ${token}`);
	variableName = variableName.toLowerCase();
	const variable = options.variables.get(variableName);
	if (variable !== undefined) {
		const declaration = variable.getDeclarationAt(token);
		if (declaration !== undefined) {
			const expressionToken = declaration.getNextSibling();
			if (expressionToken !== null &&
			(expressionToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
			expressionToken.type === ParseTreeTokenType.TUPLE_LITERAL)) {
				const valTokens = expressionToken.children.filter(mightBeDataValue);
				const toToken = valTokens[dimensionIndex];
				if (toToken !== undefined && toToken.type === ParseTreeTokenType.BINARY_OPERATOR &&
				toToken.val.toLowerCase() === 'to') {
					const firstChild = toToken.children[0];
					if (firstChild.type === ParseTreeTokenType.NUMBER_LITERAL) {
						const result = evaluateNumberLiteral(firstChild);
						if (Number.isInteger(result))
							return result;
					}
				}
			}
		}
	}

	return 0;
};