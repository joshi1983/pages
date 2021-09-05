import { addToLength } from './addToLength.js';
import { Command } from '../../../Command.js';
import { isNumber } from '../../../../isNumber.js';
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
	['removelast', -1],
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

function canInterpretIfelse(token, variableName, tokenValueMap) {
	return getIncrementAmountFromIfelse(token, variableName, tokenValueMap, 0) !== undefined;
}

function getIncrementAmountFromIfelse(token, variableName, tokenValueMap, initialLength) {
	const val1 = getIncrementForInstructionList(token.children[1], variableName, tokenValueMap, initialLength);
	const val2 = getIncrementForInstructionList(token.children[2], variableName, tokenValueMap, initialLength);
	if (val1 === val2 && isNumber(val1))
		return val1;
}

export function getIncrementForInstructionList(instructionList, variableName, tokenValueMap, initialLength) {
	let length = initialLength;
	const iChildren = instructionList.children;
	for (let i = 0; i < iChildren.length; i++) {
		const child = iChildren[i];
		if (canBeInterpretted(child, variableName, tokenValueMap))
			length = interpretCommand(child, length, variableName, tokenValueMap);
	}
	return length;
}

export function getIncrementAmountFromRepeat(repeatToken, variableName, tokenValueMap) {
	const repeatCount = Math.floor(repeatToken.children[0].val);
	const iChildren = repeatToken.children[1].children;
	const initialValue = 1000000;
	// large so it can both increase and decrease significantly without reaching any hard limits.
	// if we start at 0 and the loop dequeues from the list, it will be blocked from decreasing under 0.
	
	const instructionList = repeatToken.children[1];
	let length = getIncrementForInstructionList(instructionList, variableName, tokenValueMap, initialValue);
	return repeatCount * (length - initialValue);
};

function getLengthInfoFromSetItem(setItemToken, variableName, tokenValueMap, lengthInfo) {
	if (setItemToken.children.length < 2 || !setItemToken.children[1].isStringLiteral())
		return; // invalid children.  We don't want to throw a JavaScript error.
	if (setItemToken.children[1].val.toLowerCase() !== variableName)
		return; // different variable so no change to this one.
	const index = tokenValueMap.get(setItemToken.children[0]);
	if (!Number.isInteger(index))
		return;
	if (Number.isInteger(lengthInfo))
		return Math.max(index, lengthInfo);
	else {
		let min = Math.max(index, lengthInfo.min);
		const result = {
			'min': min
		};
		if (lengthInfo.max !== undefined)
			result.max = Math.max(index, lengthInfo.max);
		if (result.min === result.max)
			return result.min; // no need to use an object if min === max.  Keep it simple.
		return result;
	}
}

export function canBeInterpretted(token, variableName, tokenValueMap) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	if (info.primaryName === 'ifelse')
		return canInterpretIfelse(token, variableName, tokenValueMap);
	if (info.primaryName === 'setItem') {
		return getLengthInfoFromSetItem(token, variableName, tokenValueMap, 0) !== undefined;
	}
	if (commandOffsets.has(info.primaryName.toLowerCase()))
		return true;
	if (info.primaryName === 'repeat')
		return canInterpretRepeat(token, variableName);
	return false;
};

export function interpretCommand(token, lengthInfo, variableName, tokenValueMap) {
	let commandName = token.val;
	const info = Command.getCommandInfo(commandName);
	if (info.primaryName === 'ifelse')
		return getIncrementAmountFromIfelse(token, variableName, tokenValueMap, lengthInfo);
	if (info.primaryName === 'repeat')
		return addToLength(lengthInfo, getIncrementAmountFromRepeat(token, variableName, tokenValueMap));
	if (info.primaryName === 'setItem')
		return getLengthInfoFromSetItem(token, variableName, tokenValueMap, lengthInfo);
	if (!mightAffectVariableLength(token, variableName))
		return lengthInfo; // unchanged because length won't be affected.
	commandName = info.primaryName.toLowerCase();
	return addToLength(lengthInfo, commandOffsets.get(commandName));
};