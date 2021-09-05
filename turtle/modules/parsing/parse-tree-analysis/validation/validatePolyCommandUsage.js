import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { getParseTokensSorted } from '../../parse-tree-token/getParseTokensSorted.js';
import { getSortedTokenIndex } from '../cached-parse-tree/getSortedTokenIndex.js';
import { getSortedTokens } from '../cached-parse-tree/getSortedTokens.js';
import { getTokensBetween } from './poly-command-usage/getTokensBetween.js';
import { isLoop } from '../isLoop.js';
import { isLoopFound } from './poly-command-usage/isLoopFound.js';
import { isProcedureCalled } from '../isProcedureCalled.js';
import { isSingleCallEnoughForFillablePath } from './poly-command-usage/isSingleCallEnoughForFillablePath.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { pathCommandNames, pathCommandNamesStr } from '../pathCommandNames.js';
import { validatePolyStartCalledTwice } from './poly-command-usage/validatePolyStartCalledTwice.js';
import { validatePolyEndCalledTwiceInvolvingProcedure } from './poly-command-usage/validatePolyEndCalledTwiceInvolvingProcedure.js';

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
	validatePolyEndCalledTwiceInvolvingProcedure(polyEndCalls, cachedParseTree, parseLogger);
	if (polyStartCalls.length !== 0 && polyEndCalls.length !== 0) {
		polyEndCalls.forEach(function(polyEndCall) {
			const tokens = getSortedTokens(cachedParseTree);
			const endIndex = getSortedTokenIndex(cachedParseTree, polyEndCall);
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