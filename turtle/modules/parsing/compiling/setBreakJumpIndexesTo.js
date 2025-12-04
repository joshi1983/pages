import { Command } from '../Command.js';
import { JumpInstruction } from '../execution/instructions/JumpInstruction.js';
import { isLoop } from '../parse-tree-analysis/isLoop.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
Checks if the specified token is a type that could have applicable break statements.
For example, for, while, do.while, repeat, until tokens can all have applicable break statements.
*/
function mightTokenUseBreakStatements(token) {
	return isLoop(token);
}

function isBreakToken(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'break')
		return false;
	return true;
}

function isTokenApplicableTo(token, containerToken) {
	while (token !== null && token !== containerToken) {
		if (mightTokenUseBreakStatements(token))
			return false;

		token = token.parentNode;
	}
	return true;
}

export function setBreakJumpIndexesTo(newIndex, startIndex, instructions, containerParseToken) {
	if (!Number.isInteger(newIndex))
		throw new Error(`newIndex must be an integer.  Not: ${newIndex}`);
	if (!Number.isInteger(startIndex))
		throw new Error(`startIndex must be an integer.  Not: ${startIndex}`);
	if (!(instructions instanceof Array))
		throw new Error(`instructions must be an Array.  Not: ${instructions}`);
	if (newIndex < startIndex)
		throw new Error(`newIndex should not be less than startIndex.  newIndex=${newIndex}, startIndex=${startIndex}`);
	if (typeof containerParseToken !== 'object')
		throw new Error(`containerParseToken must be an object but found ${containerParseToken}`);
	if (typeof containerParseToken.val !== 'string')
		throw new Error(`containerParseToken.val must be a string but found ${containerParseToken.val}`);
		
	for (let i = startIndex; i >= 0; i--) {
		const instruction = instructions[i];
		if (instruction instanceof JumpInstruction &&
		instruction.jumpToIndex === 0 &&
		isBreakToken(instruction.parseTreeToken) &&
		isTokenApplicableTo(instruction.parseTreeToken, containerParseToken)) {
			console.log(`Setting jumpToIndex to ${newIndex}`);
			instruction.jumpToIndex = newIndex;
		}
	}
};