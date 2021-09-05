import { Command } from '../../Command.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { isAcceptableInstructionListChild } from '../isAcceptableInstructionListChild.js';
import { isInstructionList } from '../isInstructionList.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();
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

function mightBeIndependentlyUseful(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return true; // a procedure could be independently useful.
	return info.isIndependentlyUseful !== false;
}

export function validateInstructionListChildrenAllParameterizedGroups(cachedParseTree, parseLogger) {
	const instructionLists = cachedParseTree.getAllTokens().filter(isInstructionList);
	instructionLists.forEach(function(token) {
		token.children.forEach(function(childToken) {
			if (descriptionsMap[childToken.type] !== undefined && !isAcceptableInstructionListChild(childToken)) {
				parseLogger.error(`A command or procedure should be called here but you are ${getMessage(childToken)}.`, childToken);
			}
			else if (childToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
				const possiblyUseful = getDescendentsOfType(childToken, ParseTreeTokenType.PARAMETERIZED_GROUP).
					some(mightBeIndependentlyUseful);
				if (possiblyUseful === false) {
					const info = Command.getCommandInfo(childToken.val);
					let extra = '';
					if (info !== undefined) {
						extra = `  Click <span class="command">${info.primaryName}</span> to learn more about the command.`;
					}
					parseLogger.error(`A command or procedure that does something independently useful should be called here but none are. ${extra}`, childToken, extra !== '');
				}
			}
		});
	});
};