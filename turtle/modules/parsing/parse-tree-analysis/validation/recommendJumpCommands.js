import { AlphaColour } from '../../../AlphaColour.js';
import { Command } from '../../Command.js';
import { getParseTokensSorted } from '../../parse-tree-token/getParseTokensSorted.js';
import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { Transparent } from '../../../Transparent.js';
await Command.asyncInit();

const commandsOfInterest = new Set(['backward', 'forward', 'penDown', 'penUp',
	'setPenColor', 'setPenSize', 'setPos', 'setTurtleState', 'setXY', 'setXYZ'
]);
const jumpCommandMap = new Map([
	['forward', 'jumpForward'],
	['backward', 'jumpBackward'],
	['setPos', 'jumpTo'],
	['setXY', 'jumpTo'],
	['setXYZ', 'jumpTo']
]);

export { commandsOfInterest };

function getJumpCommandFor(tokenVal) {
	const commandInfo = Command.getCommandInfo(tokenVal);
	if (commandInfo === undefined)
		return; // no jump commands for procedure calls.
	return jumpCommandMap.get(commandInfo.primaryName);
}

function isSafeToContinueTracing(previousToken, interestToken) {
	if (previousToken.parentNode === interestToken.parentNode)
		return true;
	if (interestToken.parentNode === null || interestToken.parentNode.parentNode === null)
		return false;
	// interestToken.parentNode would be an instruction list, if it is in an if-statement.
	// .parentNode.parentNode would be the command associated with the control structure.
	if (interestToken.parentNode.parentNode.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(interestToken.parentNode.parentNode.val);
		if (info !== undefined && (info.primaryName === 'if' || info.primaryName === 'ifelse'))
			return isSafeToContinueTracing(previousToken, interestToken.parentNode.parentNode);
	}
	return false;
}

function updatePenUp(isPenUp, token, info, tokenToValue) {
	if (info.primaryName === 'setTurtleState')
		return MaybeDecided.Maybe;
	else if (info.primaryName !== 'penUp' && info.primaryName !== 'penDown')
		return isPenUp;
	else {
		if (info.primaryName === 'penUp')
			return MaybeDecided.Yes;
		else
			return MaybeDecided.No;
	}
}

function updateSizeZero(isSizeZero, token, info, tokenToValue) {
	if (info.primaryName === 'setTurtleState')
		return MaybeDecided.Maybe;
	else if (info.primaryName !== 'setPenSize')
		return isSizeZero;
	else {
		const tokenValue = tokenToValue(token.children[0]);
		if (tokenValue === 0)
			return MaybeDecided.Yes;
		else if (tokenValue === undefined)
			return MaybeDecided.Maybe;
		else
			return MaybeDecided.No;
	}
}

function updateTransparent(isTransparent, token, info, tokenToValue) {
	if (info.primaryName === 'setTurtleState')
		return MaybeDecided.Maybe;
	else if (info.primaryName !== 'setPenColor')
		return isTransparent;
	else if (token.children.length === 0)
		return MaybeDecided.Maybe;
	else {
		let tokenValue = tokenToValue(token.children[0]);
		if (tokenValue === undefined)
			return MaybeDecided.Maybe;
		if (tokenValue === Transparent)
			return MaybeDecided.Yes;
		if (AlphaColour.canBeInterprettedAsAlphaColour(tokenValue))
			tokenValue = new AlphaColour(tokenValue);
		if (tokenValue instanceof AlphaColour && AlphaColour.isTransparent(tokenValue))
			return MaybeDecided.Yes;
		else if (tokenValue === undefined)
			return MaybeDecided.Maybe;
		else
			return MaybeDecided.No;
	}
}

export function getTokenToJumpCommandRecommendations(tokens, tokenToValue) {
	const tokensOfInterest = tokens.filter(function(token) {
		const info = Command.getCommandInfo(token.val);
		if (info === undefined)
			return true;
		return commandsOfInterest.has(info.primaryName);
	});
	getParseTokensSorted(tokensOfInterest);
	const result = new Map();
	// unknown to start.
	let isTransparent=MaybeDecided.Maybe;
	let isSizeZero=MaybeDecided.Maybe;
	let isPenUp=MaybeDecided.Maybe;
	for (let i = 0; i < tokensOfInterest.length; i++) {
		const token = tokensOfInterest[i];
		const info = Command.getCommandInfo(token.val);
		if (info === undefined || (i !== 0 && !isSafeToContinueTracing(tokensOfInterest[i - 1], token))) {
			// Calling a procedure or entering an unsafe new instruction list means we don't know anymore.
			isTransparent = MaybeDecided.Maybe;
			isSizeZero = MaybeDecided.Maybe;
			isPenUp = MaybeDecided.Maybe;
		}
		if (info !== undefined) {
			isTransparent = updateTransparent(isTransparent, token, info, tokenToValue);
			isSizeZero = updateSizeZero(isSizeZero, token, info, tokenToValue);
			isPenUp = updatePenUp(isPenUp, token, info, tokenToValue);
		}
		const jumpCommand = getJumpCommandFor(token.val);
		let isWarning = ((isTransparent === MaybeDecided.Yes) ||
			(isSizeZero === MaybeDecided.Yes) ||
			(isPenUp === MaybeDecided.Yes)) &&
			jumpCommand !== undefined;
		if (isWarning)
			result.set(token, jumpCommand);
	}
	return result;
}

export function recommendJumpCommands(cachedParseTree, parseLogger) {
	const tokenValues = cachedParseTree.getTokenValues();
	function tokenToValue(token) {
		return tokenValues.get(token);
	}

	const recommendations = getTokenToJumpCommandRecommendations(
		getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP), tokenToValue);
	for (const [token, jumpCommand] of recommendations.entries()) {
		parseLogger.warn(`Consider using ${jumpCommand} instead of ${token.val} since the pen does not draw anything here`, token, false);
	}
};