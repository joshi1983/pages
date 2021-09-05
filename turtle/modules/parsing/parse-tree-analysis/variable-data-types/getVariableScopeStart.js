import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { isAfterOrSame } from '../../isAfterOrSame.js';
import { isLoop } from '../isLoop.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();

const rootTypes = new Set([
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD
]);
const terminatingTypes = new Set([
	ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.PROCEDURE_END_KEYWORD,
	ParseTreeTokenType.TREE_ROOT
]);

function isRepeatingLoop(token) {
	if (!isLoop(token))
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info.primaryName === 'repeat') {
		if (token.children[0].type === ParseTreeTokenType.NUMBER_LITERAL)
			return token.children[0].val > 1;
	}
	return true;
}

function getHighestLoopToken(token) {
	if (token.parentNode === null) {
		if (isRepeatingLoop(token))
			return token;
	}
	else {
		const higher = getHighestLoopToken(token.parentNode);
		if (higher !== undefined)
			return higher;
		else if (isRepeatingLoop(token))
			return token;
	}
}

function getInstructionListTokenFromLoopToken(loopToken) {
	const info = Command.getCommandInfo(loopToken.val);
	for (let i = 0; i < info.args.length; i++) {
		if (loopToken.children.length <= i)
			return; // indicate not found.  Avoid throwing an error.
			// analyzeCodeQuality should give the user a 
			// clear error message to fix the problem in the code.

		if (info.args[i].types === 'instructionlist')
			return loopToken.children[i];
	}
	// This is an internal problem with commands.json which must be fixed by a WebLogo developer.
	throw new Error('Unable to find instructionlist in info for command ' + info.primaryName);
}

function getFromLoopToken(loopToken) {
	const instructionListToken = getInstructionListTokenFromLoopToken(loopToken);
	if (instructionListToken !== undefined && instructionListToken.children.length !== 0) {
		let resultToken = instructionListToken.children[0];
		if (resultToken.isBracket() && resultToken.nextSibling !== null)
			resultToken = resultToken.nextSibling;
		return resultToken;
	}
	return loopToken;
}

export function getVariableScopeStart(cachedParseTree, assignmentToken) {
	if (assignmentToken.type === ParseTreeTokenType.LIST || terminatingTypes.has(assignmentToken.type))
		return assignmentToken;
	if (assignmentToken.parentNode === null || rootTypes.has(assignmentToken.parentNode.type)) {
		if (CommandCalls.tokenMatchesPrimaryName(assignmentToken, 'for')) {
			return getFromLoopToken(assignmentToken);
		}
		return assignmentToken;
	}
	const parentNode = assignmentToken.parentNode;
	const highestLoopToken = getHighestLoopToken(parentNode);
	if (highestLoopToken !== undefined && highestLoopToken.children.length !== 0) {
		assignmentToken = getFromLoopToken(highestLoopToken);
	}
	return assignmentToken;
};