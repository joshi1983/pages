import { areChildrenIndependentlyUseful } from '../isIndependentlyUseful.js';
import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { isFirstLevelInstruction } from '../isFirstLevelInstruction.js';
import { isInProcedure } from '../isInProcedure.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';
const commandPairs = {
	"left": ["right"],
	"right": ["left"]
};
const positionRelatedCommands = new Set([
'backward', 'jumpBackward',
'jumpForward', 'jumpIn', 'jumpLeft', 'jumpOut', 'jumpRight', 'forward']);
const positionRelatedCalculatingCommandsArray = [
	'distance', 'distanceToCircle', 'distanceToLine'
];
const positionRelatedCalculatingCommands = new Set();
for (const p of positionRelatedCalculatingCommandsArray) {
	const info = Command.getCommandInfo(p);
	SetUtils.addAll(positionRelatedCalculatingCommands, Command.getLowerCaseCommandNameSet(info));
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
	const filteredCommandCalls = commandCalls.
		filter(function(token) {
			const info = Command.getCommandInfo(token.val);
			if (!info.isConsecutiveRepeatRedundant)
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