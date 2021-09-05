import { canBeInterpretted, interpretCommand } from './interpretCommand.js';
import { Command } from '../../../Command.js';
import { getAllDescendentsAsArray } from '../../../parse-tree-token/getAllDescendentsAsArray.js';
import { isInstructionList } from '../../isInstructionList.js';
import { isProcedureCalled } from '../../isProcedureCalled.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';

const assignCommands = new Set();
['make', 'localmake'].forEach(function(commandName) {
	const info = Command.getCommandInfo(commandName);
	SetUtils.addAll(assignCommands, Command.getLowerCaseCommandNameSet(info));
});

function isVariableReference(token, variableName) {
	if (!token.isStringLiteral() ||
	variableName !== token.val.toLowerCase() ||
	token.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const parentNode = token.parentNode;
	const info = Command.getCommandInfo(parentNode.val);
	if (info === undefined)
		return false;
	const args = info.args;
	const index = parentNode.children.indexOf(token);
	if (args.length <= index)
		return false;
	
	const argInfo = args[index];
	return argInfo.refTypes !== undefined;
}

function containsVariableReference(tokens, variableName) {
	return tokens.some(function(token) {
		return isVariableReference(token, variableName);
	});
}

function isVariableRead(variableName) {
	return function(token) {
		if (token.type !== ParseTreeTokenType.VARIABLE_READ)
			return false;
		return token.val.toLowerCase() === variableName;
	};
}

function assignsVariable(variableName) {
	return function(token) {
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
		!assignCommands.has(token.val.toLowerCase()) ||
		token.children.length !== 2 ||
		!token.children[0].isStringLiteral())
			return false;
		return token.children[0].val.toLowerCase() === variableName;
	};
}

export function analyzeLengthForVariable(cachedParseTree, tokenLengthsMap, valueToken, procedureCallsMayChangeLength) {
	let length = tokenLengthsMap.get(valueToken);
	if (length === undefined)
		throw new Error(`tokenLengthsMap should have a value set for the valueToken but got undefined for valueToken ${valueToken}`);
	const parentToken = valueToken.parentNode;
	if (parentToken.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
	!assignCommands.has(parentToken.val.toLowerCase()))
		return;
	const info = Command.getCommandInfo(parentToken.val);
	if (parentToken.children.indexOf(valueToken) !== 1 ||
	!parentToken.children[0].isStringLiteral())
		return;
	if (!isInstructionList(parentToken.parentNode))
		return;
	let variableName = parentToken.children[0].val.toLowerCase();
	let instructionToken = parentToken.nextSibling;
	while (instructionToken !== null) {
		const tokens = getAllDescendentsAsArray(instructionToken);
		if (procedureCallsMayChangeLength) {
			if (isProcedureCalled(tokens))
				return; // stop.
		}
		if (canBeInterpretted(instructionToken, variableName)) {
			length = interpretCommand(instructionToken, length, variableName);
		}
		else if (instructionToken.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
			if (containsVariableReference(tokens, variableName))
				return;
			let instructionExcluded = tokens.filter(t => t !== instructionToken);
			if (instructionExcluded.some(assignsVariable(variableName)))
				return;
			const varReads = tokens.filter(isVariableRead(variableName));
			// any variable reads for variableName?
			varReads.forEach(function(varReadToken) {
				tokenLengthsMap.set(varReadToken, length);
			});
			if (assignsVariable(variableName)(instructionToken)) {
				length = tokenLengthsMap.get(instructionToken.children[1]);
				if (length === undefined)
					return; // unknown length so give up.
			}
		}
		// is a new value assigned to the variable?
		instructionToken = instructionToken.nextSibling;
	}
};