import { addToLength } from './addToLength.js';
import { Command } from '../../../Command.js';
import { mightAffectVariableLength } from './mightAffectVariableLength.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
await Command.asyncInit();

const commandsWithInstructionLists = new Set();
Command.getAllCommandsInfo().forEach(function(info) {
	if (info.args.some(argInfo => argInfo.types === 'instructionlist'))
		SetUtils.addAll(commandsWithInstructionLists, Command.getLowerCaseCommandNameSet(info));
});

const commandOffsets = new Map([
	['dequeue', -1],
	['dequeue2', -1],
	['queue', 1],
	['queue2', 1],
	['setitem', 0]
]);

function canInterpretRepeat(token, variableName) {
	if (token.children.length !== 2)
		return false;
	if (token.children[0].type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false; // we need an easy way to get the repeat count.
	const instructionList = token.children[1];
	const iChildren = instructionList.children;
	for (let i = 0; i < iChildren.length; i++) {
		const child = iChildren[i];
		if (child.isBracket())
			continue;
		if (child.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		if (!mightAffectVariableLength(child, variableName))
			continue;
		if (!canBeInterpretted(child, variableName))
			return false;
		if (commandsWithInstructionLists.has(child.val.toLowerCase()))
			return false;
	}
	return true;
}

function getIncrementAmountFromRepeat(repeatToken, variableName) {
	const repeatCount = Math.floor(repeatToken.children[0].val);
	const iChildren = repeatToken.children[1].children;
	const initialValue = 1000000;
	// large so it can both increase and decrease significantly without reaching any hard limits.
	// if we start at 0 and the loop dequeues from the list, it will be blocked from decreasing under 0.
	let length = initialValue;
	for (let i = 0; i < iChildren.length; i++) {
		const child = iChildren[i];
		if (canBeInterpretted(child, variableName))
			length = interpretCommand(child, length, variableName);
	}
	return repeatCount * (length - initialValue);
}

export function canBeInterpretted(token, variableName) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	if (commandOffsets.has(info.primaryName.toLowerCase()))
		return true;
	if (info.primaryName === 'repeat')
		return canInterpretRepeat(token, variableName);
	return false;
};

export function interpretCommand(token, lengthInfo, variableName) {
	let commandName = token.val;
	const info = Command.getCommandInfo(commandName);
	if (info.primaryName === 'repeat')
		return addToLength(lengthInfo, getIncrementAmountFromRepeat(token, variableName));
	if (!mightAffectVariableLength(token, variableName))
		return lengthInfo; // unchanged because length won't be affected.
	commandName = info.primaryName.toLowerCase();
	return addToLength(lengthInfo, commandOffsets.get(commandName));
};