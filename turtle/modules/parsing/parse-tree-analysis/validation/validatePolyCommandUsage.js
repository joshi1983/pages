import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { getParseTokensSorted } from '../../getParseTokensSorted.js';
import { isLoop } from '../isLoop.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { pathCommandNames, pathCommandNamesStr } from '../pathCommandNames.js';

function isSingleCallEnoughForFillablePath(token) {
	const info = Command.getCommandInfo(token.val);
	return info.primaryName !== 'forward' && info.primaryName !== 'backward';
}

function getTokensBetween(tokens, i, endIndex) {
	return tokens.slice(i, endIndex - 1).
		filter(tok => tok.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
		(!CommandCalls.isCommandCall(tok) || isLoop(tok) ||
		CommandCalls.tokenMatchesPrimaryNames(tok, pathCommandNames)));
}

function isProcedureCalled(tokensBetween) {
	return tokensBetween.some(tok => !CommandCalls.isCommandCall(tok));
}

function isLoopFound(tokensBetween) {
	return tokensBetween.some(tok => isLoop(tok));
}

function validatePolyStartCalledTwice(polyStartCalls, cachedParseTree, parseLogger) {
	const tokens = cachedParseTree.getSortedTokens();
	const tokenTypes = new Set([
		ParseTreeTokenType.PROCEDURE_START_KEYWORD,
		ParseTreeTokenType.PROCEDURE_END_KEYWORD
	]);
	for (let i = 1; i < polyStartCalls.length; i++) {
		const prevCall = polyStartCalls[i - 1];
		const curCall = polyStartCalls[i];
		const curIndex = cachedParseTree.getSortedTokenIndex(curCall);
		const prevIndex = cachedParseTree.getSortedTokenIndex(prevCall);
		const tokensBetween = tokens.slice(prevIndex, curIndex).some(tok => 
		tokenTypes.has(tok.type) || (tok.type === ParseTreeTokenType.PARAMETERIZED_GROUP && 
		(!CommandCalls.isCommandCall(tok) || CommandCalls.tokenMatchesPrimaryName(tok, 'polyEnd'))));
		if (!tokensBetween) {
			parseLogger.warn(`polyStart call has no effect.  You already called polyStart on line ${prevCall.lineIndex} and did not call polyEnd to end the previous polygon.`, curCall);
		}
	}
}

export function validatePolyCommandUsage(cachedParseTree, parseLogger) {
	const polyStartCalls = cachedParseTree.getCommandCallsByName('polyStart');
	const polyEndCalls = cachedParseTree.getCommandCallsByName('polyEnd');
	getParseTokensSorted(polyStartCalls);
	if (polyStartCalls.length !== 0 && polyEndCalls.length === 0) {
		polyStartCalls.forEach(function(polyStartCall) {
			parseLogger.warn('Call polyEnd when you\'re done making the polygon.  You never call polyEnd anywhere in this code so polyStart will never work.', polyStartCall);
		});
	}
	else if (polyEndCalls.length !== 0 && polyStartCalls.length === 0) {
		polyEndCalls.forEach(function(polyEndCall) {
			parseLogger.error('Calling polyEnd when you have not started a polygon will lead to an error.  Call polyStart before making the polygon.', polyEndCall);
		});
	}
	validatePolyStartCalledTwice(polyStartCalls, cachedParseTree, parseLogger);
	if (polyStartCalls.length !== 0 && polyEndCalls.length !== 0) {
		polyEndCalls.forEach(function(polyEndCall) {
			const tokens = cachedParseTree.getSortedTokens();
			const endIndex = cachedParseTree.getSortedTokenIndex(polyEndCall);
			let startIndex;
			for (let i = endIndex - 1; i >= 0; i--) {
				const token = tokens[i];
				if (CommandCalls.tokenMatchesPrimaryName(token, 'polyEnd')) {
					let tokensBetween = getTokensBetween(tokens, i, endIndex);
					const procedureFound = isProcedureCalled(tokensBetween);
					const loopFound = isLoopFound(tokensBetween);
					if (!loopFound && !procedureFound) {
						parseLogger.error('This polyEnd call will always error because there is no corresponding polyStart. ' +
							'You called polyEnd twice with no call to polyStart between them.'
							, polyEndCall);
					}
				}
				else if (CommandCalls.tokenMatchesPrimaryName(token, 'polyStart')) {
					startIndex = i;
					let tokensBetween = getTokensBetween(tokens, i, endIndex);
					const procedureFound = isProcedureCalled(tokensBetween);
					const loopFound = isLoopFound(tokensBetween);
					if (loopFound)
						tokensBetween = tokensBetween.filter(tok => !isLoop(tok));
					if (!procedureFound && !loopFound) {
						const isSingleEnough = tokensBetween.length === 1 && isSingleCallEnoughForFillablePath(tokensBetween[0]);
						if (tokensBetween.length < 2 && (tokensBetween.length === 0 || !isSingleEnough)) {
							let singleMsg = '';
							if (tokensBetween.length === 1)
								singleMsg = ` You called ${tokensBetween[0].val} once and that is path-related.  Calling it once is not enough to create a fillable path, though.`;
							parseLogger.error('This polyEnd call will always error because you did not make a path between it and the previous call to polyStart.  ' +
							'You must call at least 1 of the path-related commands such as ' + pathCommandNamesStr +
							'. At least 2 calls are needed for some since a single call to forward or back does not create a shape that can be filled. ' +
							singleMsg
							, polyEndCall);
						}
					}
					break;
				}
			}
		});
	}
};