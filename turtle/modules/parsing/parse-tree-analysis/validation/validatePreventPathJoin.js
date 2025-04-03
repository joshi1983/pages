import { Command } from
'../../Command.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export const closedShapeCommandNames = new Set([
	'circle', 'closePath', 'drawArcLineShape', 'drawArcLineShapes',
	'ellipse', 'isotoxalStar', 'isoTrapezoid', 'polyEnd', 'rect',
	'regularPolygon', 'regularStar', 'roundIsoStar',
	'roundRegularPolygon', 'roundRegularStar', 'roundRect'
]);
export const commandsToIgnore = new Set([
	'jumpForward', 'jumpIn', 'jumpLeft', 'jumpOut',
	'jumpRight', 'jumpTo', 'left', 'pitchDown',
	'pitchUp', 'right', 'rollLeft', 'rollRight',
	'setHeading', 'setPitch', 'setRoll'
]);
export const commandsPossiblyDrawingOpenPathElement = new Set([
	'arc', 'arcLeft', 'arcLines', 'arcRight', 'backward',
	'forward', 'home', 'invoke', 'setPos', 'setX', 'setY'
]);// invoke could call a procedure or a command like forward so it must be included.

const commandsPossiblyDrawingOpenPathElementArray = Array.from(commandsPossiblyDrawingOpenPathElement);

function getUnignorableCommandBefore(call) {
	call = call.previousSibling;
	while (call !== null) {
		if (call.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(call.val);
			if (info === undefined)
				return;
			else if (!commandsToIgnore.has(info.primaryName))
				return;
			return call;
		}
		else
			return;
		call = call.previousSibling;
	}
}

function shouldError(call, neverDraws) {
	const command = getUnignorableCommandBefore(call);
	if (command !== undefined) {
		const info = Command.getCommandInfo(command.val);
		if (closedShapeCommandNames.has(info.primaryName))
			return true;
	}
	
	return false;
}

function shouldWarn(call) {
	// look for a procedure call, a polyEnd, or a polyStart.
	call = call.previousSibling;
	while (call !== null) {
		if (call.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(call.val);
		if (info === undefined)
			return false;
			// We don't really know if a warning will help so assume it won't to avoid unhelpful noise.
		if (info.primaryName === 'polyEnd')
			return false; // should be an error instead of a warning.
		if (info.primaryName === 'polyStart')
			return true;

		call = call.previousSibling;
	}
	return false;
}

function isOfInterest(neverDraws) {
	return function(call) {
		return neverDraws ||
			shouldError(call, neverDraws) || shouldWarn(call);
	};
}

export function validatePreventPathJoin(cachedParseTree, parseLogger) {
	const preventPathJoinCalls = cachedParseTree.getCommandCallsByName('preventPathJoin');
	if (preventPathJoinCalls.length === 0)
		return;
	const possiblyDrawingCalls = cachedParseTree.getCommandCallsByNames(commandsPossiblyDrawingOpenPathElementArray);
	const calls = preventPathJoinCalls.filter(isOfInterest(possiblyDrawingCalls.length === 0));
	calls.forEach(function(call) {
		if (possiblyDrawingCalls.length === 0)
			parseLogger.error(`preventPathJoin must be called after drawing something but the program never draws anything that might be part of a path.  Click <span class="command">preventPathJoin</span> to learn more about the command.`, call, true);
		else if (shouldError(call)) {
			const prev = getUnignorableCommandBefore(call);
			const info = Command.getCommandInfo(prev.val);
			if (info !== undefined && closedShapeCommandNames.has(info.primaryName))
				parseLogger.error(`preventPathJoin must not be called immediately after a closed shape and <span class="command">${prev.val}</span> either draws a closed shape or closes a path.  Click <span class="command">preventPathJoin</span> to learn more about the command.`, call, true);
			else
				parseLogger.error(`preventPathJoin must be called after drawing a shape that might be joined into a path such as a straight line or arc for it to have any effect.  Click <span class="command">preventPathJoin</span> to learn more about the command.`, call, true);
		}
		else
			parseLogger.warn(`preventPathJoin should not be called within a <span class="command">polyStart</span> and <span class="command">polyEnd</span> to avoid confusion.`, call, true);
	});
};