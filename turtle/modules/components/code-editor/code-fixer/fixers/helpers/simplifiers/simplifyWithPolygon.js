import { Command } from
'../../../../../../parsing/Command.js';
import { CommandCalls } from
'../../../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDescendentsOfType } from
'../../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from
'../../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

const acceptableCommandNames = new Set([
	'jumpTo', 'setPos'
]);
const movableBeforePolyStart = new Set([
	'penDown'
]);

// some commands that are affected by changing the turtle's position.
const positionReadCommands = new Set([
	'arc', 'backward', 'forward',
	'pos', 'turtleState', 'xCor', 'yCor', 'zCor'
]);
await Command.asyncInit();
for (const info of Command.getCommandsMatchingSearchKeywords(['path', 'shape'])) {
	positionReadCommands.add(info.primaryName);
}
const skippableCommands = new Set([
	'polyEnd', 'setColors', 'setFillBlendMode', 'setFillColor', 'setFillGradient',
	'setPenBlendMode', 'setPenColor', 'setPenGradient',
	'setPenSize', 'setScreenColor',
]);
const pathBreakingCommands = new Set([
	'setPenColor', 'setPenGradient', 'setPenSize', 'setLineJoinStyle'
]);

export { acceptableCommandNames, movableBeforePolyStart, pathBreakingCommands,
positionReadCommands, skippableCommands };

function getPolyStartPolyEndWrappedTokens(token) {
	let start = token;
	while (start !== null) {
		if (CommandCalls.tokenMatchesPrimaryName(start, 'polyStart'))
			break;
		start = start.previousSibling;
	}
	if (start === null)
		return;
	let end = token;
	while (end !== null) {
		if (CommandCalls.tokenMatchesPrimaryName(start, 'polyEnd'))
			break;
		end = end.nextSibling;
	}
	if (end === null)
		return;

	const result = [];
	for (let tok = start.nextSibling; tok !== end; tok = tok.nextSibling) {
		result.push(tok);
	}
	return result;
}

function canBeMovedBeforePolyStart(info, token) {
	if (movableBeforePolyStart.has(info.primaryName))
		return true;

	if (info.primaryName === 'penUp') {
		const prev = token.previousSibling;
		if (CommandCalls.tokenMatchesPrimaryName(prev, 'polyStart')) {
			return true;
		}
		// if all acceptableCommandNames between polyStart and polyEnd are jumpTo, return true.
		const wrappedTokens = getPolyStartPolyEndWrappedTokens(token);
		if (wrappedTokens === undefined)
			return false; // unable to find corresponding polyEnd so we can't safely say that penUp can be moved.

		if (!wrappedTokens.some(t => CommandCalls.tokenMatchesPrimaryName(prev, 'setPos')))
			return true;
	}
	return false;
}

function mightTokenDirectlyReadPosition(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined ||
	positionReadCommands.has(info.primaryName))
		return true;
	return false;
}

export function mightContainPositionRead(token) {
	for (const tok of getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP)) {
		if (mightTokenDirectlyReadPosition(tok))
			return true;
	}
	return false;
};

function isFollowedByJumpTo(token) {
	const parent = token.parentNode;
	token = token.nextSibling;
	while (token !== null) {
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;

		const info = Command.getCommandInfo(token.val);
		if (info === undefined)
			return false;

		if (mightContainPositionRead(token))
			return false;

		if (info.primaryName === 'jumpTo')
			return true;

		if (!skippableCommands.has(info.primaryName))
			return false;
		
		token = token.nextSibling;
	}
	if (parent.type === ParseTreeTokenType.TREE_ROOT)
		return true;

	return false;
}

// Checks if the token contains any instructions that might cause side effects.
// The side effects could be things like:
// - assigning a new value to a variable.
// - drawing something.
export function mightContainExtraSideEffects(token) {
	const children = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	for (const child of children) {
		const info = Command.getCommandInfo(child.val);
		if (info === undefined)
			return true; // calling a procedure might cause extra side effects.
		// if it draws anything, 
		if (info.returnTypes === null) // returning null is a strong sign that the command has a side effect.
			return true;
		if (pathBreakingCommands.has(info.primaryName))
			return true;
	}
	return false;
};

function getPrecedingJumpTo(token) {
	token = token.previousSibling;
	while (token !== null) {
		if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(token.val);
			if (info === undefined)
				return;
			if (info.primaryName === 'jumpTo')
				return token;
			if (info.primaryName === 'setPos') {
				if (!mightContainExtraSideEffects(token))
					return token;
				return;
			}
		}
		else
			return;

		if (mightContainPositionRead(token))
			return;
		token = token.previousSibling;
	}
}

function isOfInterest(polyStart) {
	const info = Command.getCommandInfo(polyStart.val);
	if (info === undefined ||
	info.primaryName !== 'polyStart')
		return false;

	const precedingJumpTo = getPrecedingJumpTo(polyStart);
	if (precedingJumpTo === null || precedingJumpTo === undefined)
		return false;

	let tok = polyStart.nextSibling;
	let repositionCount = 0;
	while (tok !== null) {
		if (tok.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(tok.val);
		if (info === undefined)
			return false;
		if (info.primaryName === 'polyEnd') {
			if (repositionCount < 2)
				return false;

			return isFollowedByJumpTo(tok);
		}
		if (!canBeMovedBeforePolyStart(info, tok)) {
			if (acceptableCommandNames.has(info.primaryName))
				repositionCount++;
			else
				return false;
		}

		if (mightContainPositionRead(tok))
			return false;

		tok = tok.nextSibling;
	}
	return false;
}

function convertToPolygon(cachedParseTree, polyStart) {
	const jumpTo = getPrecedingJumpTo(polyStart);
	const jumpToInfo = Command.getCommandInfo(jumpTo.val);
	let jumpToChild = jumpTo.children[0];

	polyStart.val = 'polygon';
	if (jumpToInfo.primaryName === 'jumpTo') {
		jumpTo.lineIndex = polyStart.lineIndex;
		jumpTo.colIndex = polyStart.colIndex;
	}
	else {
		jumpToChild = jumpToChild.cloneWithDescendents();
	}
	for (const tok of getAllDescendentsAsArray(jumpToChild)) {
		tok.lineIndex = polyStart.lineIndex;
		tok.colIndex = polyStart.colIndex + 1;
	}
	const listToken = new ParseTreeToken(null, null, polyStart.lineIndex, polyStart.colIndex + 1,
		ParseTreeTokenType.LIST);
	const openBracket = new ParseTreeToken('[', null, listToken.lineIndex, listToken.colIndex,
		ParseTreeTokenType.LEAF);
	listToken.appendChild(openBracket);
	if (jumpToInfo.primaryName === 'jumpTo')
		jumpTo.remove();

	listToken.appendChild(jumpToChild);
	let token = polyStart.nextSibling;
	const removed = [];
	while (token !== null) {
		const info = Command.getCommandInfo(token.val);
		if (info.primaryName === 'polyEnd')
			break;

		const next = token.nextSibling;
		if (!acceptableCommandNames.has(info.primaryName)) {
			token.remove();
			token.lineIndex = polyStart.lineIndex;
			token.colIndex = polyStart.colIndex - 1;
			polyStart.appendPreviousSibling(token);
		}
		else {
			const firstChild = token.children[0];
			firstChild.remove();
			listToken.appendChild(firstChild);
			removed.push(token);
			token.remove();
			cachedParseTree.tokenRemoved(token);
		}
		token = next;
	}
	const polyEnd = token;
	polyEnd.val = ']';
	polyEnd.type = ParseTreeTokenType.LEAF;
	polyEnd.remove();
	listToken.appendChild(polyEnd);
	polyStart.appendChild(listToken);
	if (jumpToInfo.primaryName === 'jumpTo')
		cachedParseTree.tokenRemoved(jumpTo);
	cachedParseTree.tokensAdded([listToken, openBracket]);
	cachedParseTree.tokenTypeChanged(polyEnd, ParseTreeTokenType.PARAMETERIZED_GROUP);
}

export function simplifyWithPolygon(cachedParseTree, fixLogger) {
	const polyStarts = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	polyStarts.forEach(function(polyStartToken) {
		convertToPolygon(cachedParseTree, polyStartToken);
		fixLogger.log(`Replaced polyStart... polyEnd with polygon because that is shorter and does the same.`, polyStartToken);
	});
};