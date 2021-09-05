import { Command } from
'../../Command.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
await Command.asyncInit();

export const closedShapeCommandNames = new Set([
	'circle', 'closePath', 'drawArcLineShape', 'drawArcLineShapes',
	'ellipse', 'isotoxalStar', 'isoTrapezoid', 'isoTriangle',
	'polyEnd', 'rect',
	'regularPolygon', 'regularStar', 'roundIsoStar', 'roundIsoTriangle',
	'roundRegularPolygon', 'roundRegularStar', 'roundRect'
]);
export const commandsToIgnore = new Set([
	'jumpBackward', 'jumpForward', 'jumpIn', 'jumpLeft', 'jumpOut',
	'jumpRight', 'jumpTo', 'left', 'pitchDown',
	'pitchUp', 'preventPathJoin', 'right', 'rollLeft', 'rollRight',
	'setFillColor', 'setFillGradient',
	'setHeading', 'setPenColor', 'setPenGradient',
	'setPenSize', 'setPitch', 'setRoll'
]); 
// preventPathJoin is an interesting command to find for this validator but
// only to detect redundant calls to it.  
// Repeated, redundant calls to it are validated in 
// validateConsecutiveCommands so we don't need to check that here.

Command.getAllCommandsInfo().forEach(function(info) {
	if (info.isIndependentlyUseful === false)
		commandsToIgnore.add(info.primaryName);
});
export const commandsPossiblyDrawingOpenPathElement = new Set([
	'arc', 'arcLeft', 'arcLines', 'arcRight', 'arcsLeft', 'arcsRight', 'backward',
	'forward', 'home', 'invoke', 'setPos', 'setX', 'setY'
]);// invoke could call a procedure or a command like forward so it must be included.

const commandsPossiblyDrawingOpenPathElementArray = Array.from(commandsPossiblyDrawingOpenPathElement);

function getUnignorableCalls(token) {
	const pGroups = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return pGroups.filter(function(t) {
		const info = Command.getCommandInfo(t.val);
		if (info === undefined)
			return true;
		else
			return !commandsToIgnore.has(info.primaryName);
	});
}

function getUnignorableCommandsBefore(call) {
	call = call.previousSibling;
	while (call !== null) {
		const interestingCalls = getUnignorableCalls(call);
		if (interestingCalls.length !== 0) {
			if (containsProcedureCall(interestingCalls))
				return;
			return interestingCalls;
		}
		call = call.previousSibling;
	}
}

function shouldError(call, neverDraws) {
	const interestingCalls = getUnignorableCommandsBefore(call);
	if (interestingCalls !== undefined) {
		if (containsClosedShapeCall(interestingCalls))
			return true;
	}
	return false;
}

function containsClosedShapeCall(calls) {
	return calls.some(function(token) {
			const info = Command.getCommandInfo(token.val);
			return closedShapeCommandNames.has(info.primaryName)
		});
}

function containsProcedureCall(tokens) {
	return tokens.some(token => Command.getCommandInfo(token.val) === undefined);
}

function shouldWarnForCallsAfter(call) {
	call = call.nextSibling;
	while (call !== null) {
		const callsOfInterest = getUnignorableCalls(call);
		if (callsOfInterest.length !== 0) {
			if (containsProcedureCall(callsOfInterest))
				return false;
				// We don't really know if a warning will help so assume it won't to avoid unhelpful noise.
			for (const token of callsOfInterest) {
				const info = Command.getCommandInfo(token.val);
				if (info.primaryName === 'polyEnd' ||
				info.primaryName === 'closePath')
					return true;
				return false;
			}
		}
		call = call.nextSibling;
	}
}

function shouldWarn(call) {
	if (shouldWarnForCallsAfter(call))
		return true;
	// look for a procedure call, a polyEnd, or a polyStart.
	call = call.previousSibling;
	while (call !== null) {
		const callsOfInterest = getUnignorableCalls(call);
		if (callsOfInterest.length !== 0) {
			if (containsProcedureCall(callsOfInterest))
				return false;
				// We don't really know if a warning will help so assume it won't to avoid unhelpful noise.
			for (const token of callsOfInterest) {
				const info = Command.getCommandInfo(token.val);
				if (info.primaryName === 'polyEnd')
					return false; // should be an error instead of a warning.
				if (info.primaryName === 'polyStart')
					return true;
			}
		}
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
			const prev = getUnignorableCommandsBefore(call);
			if (containsClosedShapeCall(prev))
				parseLogger.error(`preventPathJoin must not be called immediately after a closed shape but the previous shape is either a closed shape or closes a path.  Click <span class="command">preventPathJoin</span> to learn more about the command.`, call, true);
			else
				parseLogger.error(`preventPathJoin must be called after drawing a shape that might be joined into a path such as a straight line or arc for it to have any effect.  Click <span class="command">preventPathJoin</span> to learn more about the command.`, call, true);
		}
		else if (shouldWarnForCallsAfter(call))
			parseLogger.warn(`preventPathJoin should not be called immediately before <span class="command">closePath</span> or <span class="command">polyEnd</span> because that makes preventPathJoin do nothing.`, call, true);
		else
			parseLogger.warn(`preventPathJoin should not be called within a <span class="command">polyStart</span> and <span class="command">polyEnd</span> to avoid confusion.`, call, true);
	});
};