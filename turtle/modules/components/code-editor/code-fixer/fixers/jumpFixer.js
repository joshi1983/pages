import { ArrayUtils } from '../../../../ArrayUtils.js';
import { Command } from '../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from '../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDescendentsOfType } from '../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
await Command.asyncInit();
const jumpCommandNames = new Set();
['jumpLeft', 'jumpRight', 'jumpForward', 'jumpBackward'].forEach(function(name) {
	const info = Command.getCommandInfo(name);
	SetUtils.addAll(jumpCommandNames, Command.getLowerCaseCommandNameSet(info));
});
const turnCommandNames = new Set(['left', 'right']);
const angleOffsetsMap = new Map([
	['jumpForward', 0],
	['jumpBackward', 180],
	['jumpLeft', 270],
	['jumpRight', 90],
]);
const angleToJumpCommandMap = new Map();
for (const [command, angle] of angleOffsetsMap) {
	angleToJumpCommandMap.set(angle, command);
}

function isSuitableTurnAngleToken(token) {
	if (token === undefined)
		return false;
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL &&
	token.val === 90 || token.val === -90)
		return true;
	return false;
}

function getTurnRightAngleWithSign(turnToken) {
	let angle = turnToken.children[0].val;
	const turnInfo = Command.getCommandInfo(turnToken.val);
	if (turnInfo.primaryName === 'left')
		return -angle;
	return angle;
}

function getMoveAngle(jumpToken) {
	const prevLeftAngle = getTurnRightAngleWithSign(jumpToken.previousSibling);
	const nextLeftAngle = getTurnRightAngleWithSign(jumpToken.nextSibling);
	if (prevLeftAngle !== -nextLeftAngle)
		return;
	const jumpPrimaryName = Command.getCommandInfo(jumpToken.val).primaryName;
	const offset = angleOffsetsMap.get(jumpPrimaryName);
	return prevLeftAngle + offset;
}

function isOfInterest(token) {
	if (!jumpCommandNames.has(token.val.toLowerCase()))
		return false;
	const prev = token.previousSibling;
	if (prev === null || prev.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const prevInfo = Command.getCommandInfo(prev.val);
	if (prevInfo === undefined || !turnCommandNames.has(prevInfo.primaryName))
		return false;
	if (!isSuitableTurnAngleToken(prev.children[0]))
		return false;
	const next = token.nextSibling;
	if (next === null || next.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const nextInfo = Command.getCommandInfo(next.val);
	if (nextInfo === undefined || !turnCommandNames.has(nextInfo.primaryName))
		return false;
	if (!isSuitableTurnAngleToken(next.children[0]))
		return false;
	const jumpCommandName = getNewCommandNameFor(token);
	if (jumpCommandName === undefined)
		return false;
	return true;
}

function getNewCommandNameFor(jumpToken) {
	let angle = getMoveAngle(jumpToken);
	if (angle === undefined)
		return;
	if (angle < 0)
		angle += 360;
	const newName = angleToJumpCommandMap.get(angle);
	if (newName === undefined)
		console.error(`unable to get command name for angle ${angle}`);
	return newName;
}

function isNotCallingProcedure(jumpToken) {
	const descendents = getDescendentsOfType(jumpToken, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return !descendents.some(t => Command.getCommandInfo(t.val) === undefined);
}

export function jumpFixer(cachedParseTree, fixLogger) {
	let jumps = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	if (jumps.length === 0)
		return;
	jumps = jumps.filter(isNotCallingProcedure);
	const tokensRemoved = [];
	jumps.forEach(function(jumpToken) {
		const oldVal = jumpToken.val;
		const newName = getNewCommandNameFor(jumpToken);
		if (newName === undefined)
			return; // do nothing when we can't get an appropriate new name for the jump call.
		jumpToken.val = newName;
		const prev = jumpToken.previousSibling;
		const next = jumpToken.nextSibling;
		cachedParseTree.tokenValueChanged(jumpToken, oldVal);
		prev.remove();
		next.remove();
		fixLogger.log(`Converted <span class="command">${oldVal}</span> and surrounding turn commands into <span class="command">${jumpToken.val}</span> because it is shorter code`, jumpToken, true);
		ArrayUtils.pushAll(tokensRemoved, getAllDescendentsAsArray(prev));
		ArrayUtils.pushAll(tokensRemoved, getAllDescendentsAsArray(next));
		tokensRemoved.push(prev, next);
	});
	cachedParseTree.tokensRemoved(tokensRemoved);
};