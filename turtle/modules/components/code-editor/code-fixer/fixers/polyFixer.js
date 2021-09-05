import { Command } from '../../../../parsing/Command.js';
import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getDescendentsOfType } from '../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getPolyUnsafeProcedures } from './helpers/getPolyUnsafeProcedures.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';

const endPolyNames = Command.getLowerCaseCommandNameSet(
	Command.getCommandInfo('polyEnd'));
const circleNames = new Set();
const canBeIgnoredNames = new Set();
['circle', 'circleLeft', 'circleRight'].forEach(function(primaryName) {
	const info = Command.getCommandInfo(primaryName);
	if (info === undefined)
		throw new Error(`Unable to find command named ${primaryName}`);
	const names = Command.getLowerCaseCommandNameSet(info);
	SetUtils.addAll(circleNames, names);
});
/*
Some commands that are not affected by being in or out of a path(between polyStart and polyEnd).
*/
['ellipse', 'ellipse2', 'left', 'localmake', 'make',
'penDown', 'penNormal',
'penUp', 'right', 'setColors',
'setFillColor', 'setFillGradient', 'setPenColor',
'setPenGradient', 'setPenSize'].forEach(function(primaryName) {
	const info = Command.getCommandInfo(primaryName);
	if (info === undefined)
		throw new Error(`Unable to find command named ${primaryName}`);
	const names = Command.getLowerCaseCommandNameSet(info);
	SetUtils.addAll(canBeIgnoredNames, names);
});

function isOfInterest(token) {
	let nextSibling = token.nextSibling;
	while (true) {
		if (nextSibling === null || nextSibling.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		if (endPolyNames.has(nextSibling.val.toLowerCase()))
			return true;
		if (!circleNames.has(nextSibling.val.toLowerCase())) {
			if (!canBeIgnoredNames.has(nextSibling.val.toLowerCase()))
				return false;
		}
		nextSibling = nextSibling.nextSibling;
	}
}

function filterUnsafeProcedureCalls(cachedParseTree, tokensToChange) {
	const unsafeProcs = getPolyUnsafeProcedures(cachedParseTree);
	return tokensToChange.filter(function(token) {
		let nextSibling = token.nextSibling;
		while (true) {
			if (endPolyNames.has(nextSibling.val.toLowerCase()))
				return true;
			const pGroupTokens = getDescendentsOfType(nextSibling, ParseTreeTokenType.PARAMETERIZED_GROUP);
			if (pGroupTokens.some(token => Command.getCommandInfo(token.val) === undefined &&
				unsafeProcs.has(token.val.toLowerCase())))
				return false;
			nextSibling = nextSibling.nextSibling;
		}
	});
}

export function polyFixer(cachedParseTree, fixLogger) {
	let tokensToChange = CommandCalls.filterCommandCalls(
		cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP),
		'polyStart').filter(isOfInterest);
	if (tokensToChange.length === 0)
		return;
	tokensToChange = filterUnsafeProcedureCalls(cachedParseTree, tokensToChange);
	tokensToChange.forEach(function(polyStart) {
		let nextSibling = polyStart.nextSibling;
		polyStart.remove();
		cachedParseTree.tokenRemoved(polyStart);
		if (CommandCalls.tokenMatchesPrimaryName(nextSibling, 'polyEnd')) {
			nextSibling.remove();
			cachedParseTree.tokenRemoved(nextSibling);
			fixLogger.log(`Removed polyStart and polyEnd because they didn't wrap around commands that would draw a path`, polyStart);
		}
		else {
			do {
				nextSibling = nextSibling.nextSibling;
			}
			while (!CommandCalls.tokenMatchesPrimaryName(nextSibling, 'polyEnd'));
			nextSibling.remove();
			cachedParseTree.tokenRemoved(nextSibling);
			fixLogger.log(`Removed polyStart and polyEnd because they wrapped a command that fills itself`, polyStart);
		}
	});
};