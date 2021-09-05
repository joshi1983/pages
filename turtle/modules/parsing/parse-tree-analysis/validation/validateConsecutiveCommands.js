import { areChildrenIndependentlyUseful } from '../isIndependentlyUseful.js';
import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { isFirstLevelInstruction } from '../isFirstLevelInstruction.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';
const commandPairs = {
	"left": ["right"],
	"right": ["left"]
};
const positionRelatedCommands = new Set([
'backward', 'circlePair', 'jumpBackward',
'jumpForward', 'jumpIn', 'jumpLeft', 'jumpOut', 'jumpRight', 'forward',
'setPos']);
const positionRelatedCalculatingCommandsArray = [
	'distance', 'distanceToCircle', 'distanceToLine'
];
const positionRelatedCalculatingCommands = new Set();
for (const p of positionRelatedCalculatingCommandsArray) {
	SetUtils.addAll(positionRelatedCalculatingCommands, Command.getLowerCaseCommandNameSet(p));
}
const polyEndNames = Command.getLowerCaseCommandNameSet('polyEnd');

function mightCallPolyStart(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	return info === undefined ||// assume any procedure call might call polyStart.
		info.primaryName === 'polyStart';
}

function isAfterPolyEnd(token) {
	while (token !== null) {
		const descendents = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
		descendents.push(token);
		if (descendents.some(mightCallPolyStart))
			return false;
		else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
		polyEndNames.has(token.val.toLowerCase()))
			return true;
		token = token.previousSibling;
	}
	return false;
}

function isUninterestingException(token) {
	const info = Command.getCommandInfo(token.val);
	if (positionRelatedCommands.has(info.primaryName)) {
		const tokens = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
		return tokens.
			some(t => positionRelatedCalculatingCommands.has(t.val.toLowerCase()));
	}
	return false;
}

export function validateConsecutiveCommands(cachedParseTree, parseLogger) {
	const commandCalls = cachedParseTree.getCommandCallsArray().
		filter(isFirstLevelInstruction).filter(function(token) {
			if (token.previousSibling === null || !CommandCalls.isCommandCall(token.previousSibling))
				return false;
			if (isUninterestingException(token))
				return false;
			return !areChildrenIndependentlyUseful(token, cachedParseTree.getProceduresMap()) &&
				!areChildrenIndependentlyUseful(token.previousSibling, cachedParseTree.getProceduresMap());
		});
	const polyStarts = cachedParseTree.getCommandCallsByName('polyStart');
	const filteredCommandCalls = commandCalls.
		filter(function(token) {
			const info = Command.getCommandInfo(token.val);
			if (!info.isConsecutiveRepeatRedundant)
				return false;
			if (polyStarts.length !== 0 && info.primaryName === 'setPos' &&
			!isAfterPolyEnd(token))
				return false;
			return true;
		});
	filteredCommandCalls.forEach(function(token) {
		const prevInfo = Command.getCommandInfo(token.previousSibling.val);
		const info = Command.getCommandInfo(token.val);
		if (info.primaryName === prevInfo.primaryName) {
			parseLogger.warn('Consider combining your consecutive calls to "' + info.primaryName + '" into 1.  That will be less code.', token);
		}
		else if (commandPairs[info.primaryName] !== undefined && commandPairs[info.primaryName].indexOf(prevInfo.primaryName) !== -1) {
			parseLogger.warn('Consider combining your consecutive calls to "' + prevInfo.primaryName + '" and "' + info.primaryName + '" into 1.  That can more concisely express what you want.', token);
		}
	});
};