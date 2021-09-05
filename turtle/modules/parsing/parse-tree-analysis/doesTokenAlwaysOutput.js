import { Command } from '../Command.js';
import { isAlwaysTrueToken } from './isAlwaysTrueToken.js';
import { isOutputOrStopToken } from './isOutputOrStopToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function doesInstructionListAlwaysOutput(instructionListToken) {
	if (instructionListToken.type !== ParseTreeTokenType.LIST)
		throw new Error('instructionListToken must be a list');

	const instructions = instructionListToken.children;
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (doesTokenAlwaysOutput(instruction))
			return true;
	}
	return false;
}

function doesIfAlwaysOutput(token) {
	if (token.children.length !== 2)
		return false;
	const proceduresMap = new Map();
	if (!isAlwaysTrueToken(token.children[0], proceduresMap))
		return false;
	return doesTokenAlwaysOutput(token.children[1]);
}

function doesIfElseAlwaysOutput(ifElseToken) {
	const children = ifElseToken.children;
	// if weird case, we don't want to throw an error.
	if (children.length < 3)
		return false;

	// another case where parsing must have failed somewhere.
	// avoid an error and just return false.
	if (children[1].type !== ParseTreeTokenType.LIST ||
		children[2].type !== ParseTreeTokenType.LIST)
		return false;
	return doesInstructionListAlwaysOutput(children[1]) &&
		doesInstructionListAlwaysOutput(children[2]);
}

function doesRepeatAlwaysOutput(repeatToken) {
	if (repeatToken.children.length !== 2)
		return false;
	if (repeatToken.children[0].type === ParseTreeTokenType.NUMBER_LITERAL && repeatToken.children[0].val < 1)
		return false;
	if (repeatToken.children[1].type !== ParseTreeTokenType.LIST)
		return false; // this should cause an error in code quality checks but not be considered an infinite loop.
	return doesInstructionListAlwaysOutput(repeatToken.children[1]);
}

/*
Returns true for all the cases we can reasonably check.
May return false in cases that should be true, if we haven't yet implemented 
a thorough enough check to find out why it would always output.
*/
export function doesTokenAlwaysOutput(token) {
	if (isOutputOrStopToken(token))
		return true;
	if (token.type === ParseTreeTokenType.LIST) {
		for (let i = 0; i < token.children.length; i++) {
			if (doesTokenAlwaysOutput(token.children[i]))
				return true;
		}
	}
	else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const command = Command.getCommandInfo(token.val);
		if (command !== undefined) {
			if (command.primaryName === 'ifelse')
				return doesIfElseAlwaysOutput(token);
			if (command.primaryName === 'if')
				return doesIfAlwaysOutput(token);
			if (command.primaryName === 'repeat')
				return doesRepeatAlwaysOutput(token);
		}
	}
	return false;
};