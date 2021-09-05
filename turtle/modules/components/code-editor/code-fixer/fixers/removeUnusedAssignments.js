import { ArrayUtils } from '../../../../ArrayUtils.js';
import { Command } from '../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from '../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDescendentsOfType } from '../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getProcedureStartToken } from
'../../../../parsing/parse-tree-analysis/getProcedureStartToken.js';
import { getTokenValueBasic } from
'../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { MaybeDecided } from
'../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
import { tokenToProcedure } from
'../../../../parsing/parse-tree-analysis/tokenToProcedure.js';
await Command.asyncInit();

const makeNames = new Set();
['localmake', 'make'].forEach(function(name) {
	SetUtils.addAll(makeNames, Command.getLowerCaseCommandNameSet(Command.getCommandInfo(name)));
});
const assignBeforeReadCommandNames = new Set();
['do.while', 'for', 'forever', 'while'].forEach(function(name) {
	SetUtils.addAll(assignBeforeReadCommandNames, Command.getLowerCaseCommandNameSet(Command.getCommandInfo(name)));
});
const typesToContinueChecking = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.PARAMETERIZED_GROUP,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD
]);

function loopToInstructionListToken(loopToken) {
	const loopCommandName = loopToken.val.toLowerCase();
	if (loopCommandName === 'for' || loopCommandName === 'while')
		return loopToken.children[1];

	return loopToken.children[0];
}

function mightHaveSideEffects(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return true; // procedure calls could generally have side effects.
	if (makeNames.has(token.val.toLowerCase()))
		return false; // assume that is the root token checked.
	if (info.isIndependentlyUseful === true)
		return true;
	return false;
}

function mightCauseExtraSideEffects(token) {
	const calls = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return calls.some(mightHaveSideEffects)
}

// Note that the return type is not boolean.  It is MaybeDecided.
// Compare results with the appropriate values from MaybeDecided.
function isGlobalVariableAssignment(makeToken) {
	if (makeToken.val.toLowerCase() === 'localmake')
		return MaybeDecided.No;

	const procStartToken = getProcedureStartToken(makeToken);
	if (procStartToken === undefined)
		return MaybeDecided.Yes; // if not in a procedure, every variable is global.

	if (makeToken.children.length !== 0) {
		const procedure = tokenToProcedure(procStartToken);
		const varName = makeToken.children[0].val.toLowerCase();
		if (procedure.parameters.some(p => p === varName))
			return MaybeDecided.No; // a procedure's parameter can not be global.
		
		// FIXME: look for localmake calls in the procedure matching the same variable name.
		// if none are found, return MaybeDecided.Yes because a localmake will be needed to make the variable local.
	}

	return MaybeDecided.Maybe;// We don't know if the assignment will affect a global variable.
}

function mightProcedureReadVariable(varAssignToken) {
	const varName = varAssignToken.children[0].val.toLowerCase();
	return function(token) {
		const info = Command.getCommandInfo(token.val);
		if (info === undefined)
			return true;
		return false;
	};
}

function mightReadVariable(next, varAssignToken, mightBeGlobalVariable) {
	const varName = varAssignToken.children[0].val.toLowerCase();
	if (mightBeGlobalVariable === MaybeDecided.No) {
		const nextProc = getProcedureStartToken(next);
		const varAssignProc = getProcedureStartToken(varAssignToken);
		if (nextProc !== undefined && nextProc.name !== varAssignProc.name)
			return false;
	}
	if (getDescendentsOfType(next, ParseTreeTokenType.VARIABLE_READ).some(
	tok => tok.val.toLowerCase() === varName))
		return true;

	if (mightBeGlobalVariable !== MaybeDecided.No &&
	getDescendentsOfType(next, ParseTreeTokenType.PARAMETERIZED_GROUP).
	some(mightProcedureReadVariable(varAssignToken)))
		return true;
	return false;
}

function definitelyAssignsVariable(token, varAssignToken) {
	if (token === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token.children.length === 3)
		token = token.children[1];
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	const varName = varAssignToken.children[0].val.toLowerCase();
	if (makeNames.has(token.val.toLowerCase()) &&
	token.children.length === 2 &&
	token.children[0].val.toLowerCase() === varName)
		return true;

	return false;
}

function definitelyAssignsBeforeReading(token, varAssignToken, mightBeGlobalVariable) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	const varName = varAssignToken.children[0].val.toLowerCase();
	const commandName = token.val.toLowerCase();
	if (commandName === 'while') {
		const conditionToken = token.children[0];
		// if conditionToken might be initially false, return false.
		const val = getTokenValueBasic(conditionToken);
		if (val === undefined || val === false || val === 0)
			return false;
	}
	else if (commandName === 'for') {
		const forLoopSettings = token.children[0];
		if (forLoopSettings === undefined || forLoopSettings.type !== ParseTreeTokenType.LIST)
			return false; // weird case that might happen if syntax is invalid.
		const forLoopVariableToken = forLoopSettings.children[1];
		if (forLoopVariableToken === undefined || !forLoopVariableToken.isStringLiteral())
			return false;
		if (forLoopVariableToken.val.toLowerCase() === varName)
			return true; // for-loop variable matches so it definitely assigns a value to the same variable.
	}
	if (assignBeforeReadCommandNames.has(token.val.toLowerCase()) &&
	token.children.length !== 0) {
		let instructionList = loopToInstructionListToken(token);
		for (let next = instructionList.children[1]; next !== null; next = next.nextSibling) {
			if (mightReadVariable(next, varAssignToken, mightBeGlobalVariable))
				return false;
			if (definitelyAssignsVariable(next, varAssignToken))
				return true;
		}
	}
	return false;
}

function isMakeOfInterest(cachedParseTree) {
	return function(token) {
		if (!makeNames.has(token.val.toLowerCase()) || token.children.length !== 2 ||
		!token.children[0].isStringLiteral())
			return false;
		if (mightCauseExtraSideEffects(token))
			return false;
		const varName = token.children[0].val.toLowerCase();
		const mightBeGlobalVariable = isGlobalVariableAssignment(token);
		// look for assignments to the same variable.
		for (let next = token.nextSibling; next !== null;next = next.nextSibling) {
			if (!typesToContinueChecking.has(next.type))
				return false;
			if (definitelyAssignsBeforeReading(next, token, mightBeGlobalVariable))
				return true;
			if (mightReadVariable(next, token, mightBeGlobalVariable))
				return false;
			if (definitelyAssignsVariable(next, token))
				return true;
		}
		return false;
	};
}

export function removeUnusedAssignments(cachedParseTree, fixLogger) {
	const makes = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isMakeOfInterest(cachedParseTree));
	const tokensToRemove = [];
	makes.forEach(function(makeToken) {
		tokensToRemove.push(makeToken);
		ArrayUtils.pushAll(tokensToRemove, getAllDescendentsAsArray(makeToken));
		makeToken.remove();
		fixLogger.log(`Removed call to ${makeToken.val} because the value was replaced before being read`, makeToken);
	});
	cachedParseTree.tokensRemoved(tokensToRemove);
};