import { Command } from '../Command.js';
import { CommandCalls } from './CommandCalls.js';
import { ForLoops } from './ForLoops.js';
import { getAllDescendentsAsArray } from '../parse-tree-token/getAllDescendentsAsArray.js';
import { getInstructionListChildToken } from './getInstructionListChildToken.js';
import { getProcedureStartToken } from './getProcedureStartToken.js';
import { isFirstLevelInstruction } from './isFirstLevelInstruction.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { tokenToProcedure } from './tokenToProcedure.js';
await Command.asyncInit();

function mightSetAVariable(token) {
	return CommandCalls.isCommandCall(token) &&
		token.children.length >= 2 &&
		[ParseTreeTokenType.LIST, ParseTreeTokenType.STRING_LITERAL].indexOf(token.children[0].type) !== -1;
}

export function getAllLocalVariablesAndParameters(token) {
	const procToken = getProcedureToken(token);
	const result = new Set();
	// add procedure parameters.
	if (procToken.children.length > 1 && procToken.children[1].type === ParseTreeTokenType.LIST) {
		procToken.children[1].children.forEach(function(paramToken) {
			if (paramToken.type === ParseTreeTokenType.VARIABLE_READ) {
				result.add(paramToken.val.toLowerCase());
			}
		});
	}
	// Add local variables and for-loop control variables.
	getAllDescendentsAsArray(procToken).filter(mightSetAVariable).forEach(function(childToken) {
		const commandInfo = Command.getCommandInfo(childToken.val);
		if (commandInfo.primaryName === 'localmake' && typeof childToken.children[0].val === 'string')
			result.add(childToken.children[0].val.toLowerCase());
		else if (commandInfo.primaryName === 'for' && childToken.children[0].children.length > 1) {
			const forLoopVariableName = childToken.children[0].children[1].val;
			result.add(forLoopVariableName); // add for-loop control variable.
		}
	});

	return result;
};

function getProcedureToken(token) {
	if (token === null)
		return null;
	else if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return token;
	else
		return getProcedureToken(token.parentNode);
}

export function isReadingForLoopVariable(token, variableName) {
	if (token === null)
		return false;
	if (variableName === undefined)
		variableName = token.val.toLowerCase();
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.children.length > 0 && token.children[0].children.length > 1 &&
	typeof token.children[0].children[1].val === 'string') {
		const commandInfo = Command.getCommandInfo(token.val);
		if (commandInfo !== undefined && commandInfo.primaryName === 'for') {
			const forLoopVariableName = token.children[0].children[1].val.toLowerCase();
			if (forLoopVariableName === variableName)
				return true;
		}
	}
	return isReadingForLoopVariable(token.parentNode, variableName);
};