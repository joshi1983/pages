import { ArrayUtils } from '../../../../ArrayUtils.js';
import { Command } from '../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from '../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDescendentsOfType } from '../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getProcedureStartToken } from
'../../../../parsing/parse-tree-analysis/getProcedureStartToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
await Command.asyncInit();

const makeNames = new Set();
['localmake', 'make'].forEach(function(name) {
	SetUtils.addAll(makeNames, Command.getLowerCaseCommandNameSet(Command.getCommandInfo(name)));
});
const assignBeforeReadCommandNames = new Set();
['do.while', 'forever'].forEach(function(name) {
	SetUtils.addAll(assignBeforeReadCommandNames, Command.getLowerCaseCommandNameSet(Command.getCommandInfo(name)));
});
const typesToContinueChecking = new Set([
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.PARAMETERIZED_GROUP,
ParseTreeTokenType.PROCEDURE_START_KEYWORD
]);

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

function mightBeGlobalVariableAssignment(makeToken) {
	if (makeToken.val.toLowerCase() === 'localmake')
		return false;
	// FIXME: check if in procedure and matches a parameter name.
		// can confidently return false then.

	return true;
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
	if (mightBeGlobalVariable === false) {
		const nextProc = getProcedureStartToken(next);
		const varAssignProc = getProcedureStartToken(varAssignToken);
		if (nextProc !== undefined && nextProc.name !== varAssignProc.name)
			return false;
	}
	if (getDescendentsOfType(next, ParseTreeTokenType.VARIABLE_READ).some(
	tok => tok.val.toLowerCase() === varName))
		return true;
	if (getDescendentsOfType(next, ParseTreeTokenType.PARAMETERIZED_GROUP).
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
	if (assignBeforeReadCommandNames.has(token.val.toLowerCase()) &&
	token.children.length !== 0) {
		const instructionList = token.children[0];
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
		const mightBeGlobalVariable = mightBeGlobalVariableAssignment(token);
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