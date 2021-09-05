import { areChildrenIndependentlyUseful } from '../isIndependentlyUseful.js';
import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { isFirstLevelInstruction } from '../isFirstLevelInstruction.js';
import { isInProcedure } from '../isInProcedure.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const commandPairs = {
	"left": ["right"],
	"right": ["left"]
};

export function validateConsecutiveCommands(cachedParseTree, parseLogger) {
	const commandCalls = cachedParseTree.getCommandCallsArray().
		filter(isFirstLevelInstruction).filter(function(token) {
			if (token.previousSibling === null || !CommandCalls.isCommandCall(token.previousSibling))
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
	commandCalls.filter(function(token) {
		if (!CommandCalls.tokenMatchesPrimaryName(token, 'localmake') && !CommandCalls.tokenMatchesPrimaryName(token, 'make'))
			return false;
		return token.children.length > 0 && token.children[0].type === ParseTreeTokenType.STRING_LITERAL &&
			token.previousSibling.children.length > 0 && token.previousSibling.type === ParseTreeTokenType.STRING_LITERAL;
	}).forEach(function(token) {
		const prevInfo = Command.getCommandInfo(token.previousSibling.val);
		const info = Command.getCommandInfo(token.val);
		if (prevInfo.primaryName === 'localmake' || !isInProcedure(token)) {
			const varName1 = token.children[0].val.toLowerCase();
			const varName2 = token.previousSibling.children[0].val.toLowerCase();
			if (varName1 === varName2) {
				let msg = undefined;
				if (prevInfo.primaryName === info.primaryName)
					msg = 'Consider combining your calls to "' + prevInfo.primaryName + '" into 1 since both set the same variable "' 
						+ varName1 + '".  It will shorten your code.';
				else
					msg = 'You are setting variable "' + varName1 + '" twice.  Consider combining to shorten code.';
				logger(msg, token);
			}
		}
	});
};