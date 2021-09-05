import { isInstructionList } from '../isInstructionList.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
const descriptionsMap = [];
descriptionsMap[ParseTreeTokenType.BINARY_OPERATOR] = 'using a binary operator';
descriptionsMap[ParseTreeTokenType.BOOLEAN_LITERAL] = 'just writing true or false';
descriptionsMap[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION] = 'evaluating an expression';
descriptionsMap[ParseTreeTokenType.NUMBER_LITERAL] = 'just writing a number';
descriptionsMap[ParseTreeTokenType.LIST] = 'defining a list';
descriptionsMap[ParseTreeTokenType.STRING_LITERAL] = 'writing a string';
descriptionsMap[ParseTreeTokenType.UNARY_OPERATOR] = 'using a unary operator';
descriptionsMap[ParseTreeTokenType.VARIABLE_READ] = 'just reading from a variable';

function getMessage(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return descriptionsMap[token.type] + ` named "${token.val}"`;

	return descriptionsMap[token.type];
}

export function validateInstructionListChildrenAllParameterizedGroups(cachedParseTree, parseLogger) {
	const instructionLists = cachedParseTree.getAllTokens().filter(isInstructionList);
	instructionLists.forEach(function(token) {
		token.children.forEach(function(childToken) {
			if (descriptionsMap[childToken.type] !== undefined) {
				parseLogger.error(`A command or procedure should be called here but you are ${getMessage(childToken)}.`, childToken);
			}
		});
	});
};