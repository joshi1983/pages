import { Command } from
'../../../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDescendentsOfType } from
'../../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getProcedureStartToken } from
'../../../../../../parsing/parse-tree-analysis/getProcedureStartToken.js';
import { getTokenValueBasic } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { isNumber } from
'../../../../../../isNumber.js';
import { isAfterOrSame } from
'../../../../../../parsing/generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from
'../../../../../../parsing/Procedure.js';
import { SetUtils } from
'../../../../../../SetUtils.js';
import { tokenToProcedure } from
'../../../../../../parsing/parse-tree-analysis/tokenToProcedure.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

await Command.asyncInit();
const makeCommandNames = new Set();
for (const name of ['localmake', 'make']) {
	SetUtils.addAll(makeCommandNames, Command.getLowerCaseCommandNameSet(name));
}

function getVariableReadsFor(token, procStart, varName) {
	const variableReads = getDescendentsOfType(procStart,
		ParseTreeTokenType.VARIABLE_READ).
		filter(t => t.val.toLowerCase() === varName &&
			isAfterOrSame(t, token) &&
			!Procedure.isParameterToken(t));
	return variableReads;
}

function makeToVarName(makeToken) {
	const varNameToken = makeToken.children[0];
	if (varNameToken === undefined || !varNameToken.isStringLiteral())
		return;

	return varNameToken.val.toLowerCase();
}

function makeCallToValue(makeToken) {
	const valToken = makeToken.children[1];
	return getTokenValueBasic(valToken);
}

function isValueOfInterest(value) {
	if (typeof value !== 'string' && !isNumber(value))
		return false;
	return true;
}

function isMakeCall(token) {
	const val = token.val.toLowerCase();
	if (!makeCommandNames.has(val))
		return false;
	return true;
}

function isParameter(procStart, varName) {
	const proc = tokenToProcedure(procStart);
	return proc.parameters.indexOf(varName) !== -1;
}

function isOfInterest(token) {
	if (!isMakeCall(token) || token.children.length !== 2)
		return false;

	const procStart = getProcedureStartToken(token);
	if (procStart === null)
		return false; // we're interested only in local variables.

	const varName = makeToVarName(token);
	const val = makeCallToValue(token);
	if (!isValueOfInterest(val))
		return false;

	const makesForSameVariable = getDescendentsOfType(procStart, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(t => isMakeCall(t) && makeToVarName(t) === varName);
	if (makesForSameVariable.length !== 1)
		return false; // the extra makes mean this isn't really constant.

	const info = Command.getCommandInfo(token.val);
	if (info.primaryName === 'make') {
		if (!isParameter(procStart, varName))
			return false; // We don't want to treat global variables as if they're constants.
	}
	const variableReads = getVariableReadsFor(token, procStart, varName);
	return variableReads.length !== 0;
		// There must be a variable read to substitute or this fixer is not doing enough to be worth logging a fix.
}

export function substituteLocalConstants(cachedParseTree, fixLogger) {
	const makes = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	makes.forEach(function(makeCall) {
		const newVal = makeCallToValue(makeCall);
		if (!isValueOfInterest(newVal))
			return; // a previous make fix might have made this one inappropriate for fixing.

		const varName = makeToVarName(makeCall);
		const newValLiteral = valueToLiteralCode(newVal);
		const procStart = getProcedureStartToken(makeCall);
		const variableReads = getVariableReadsFor(makeCall, procStart, varName);
		const toRemove = getAllDescendentsAsArray(makeCall);
		toRemove.push(makeCall);
		for (const varRead of variableReads) {
			varRead.val = newVal;
			if (isNumber(newVal))
				varRead.type = ParseTreeTokenType.NUMBER_LITERAL;
			else if (newValLiteral[0] === '"')
				varRead.type = ParseTreeTokenType.STRING_LITERAL;
			else
				varRead.type = ParseTreeTokenType.LONG_STRING_LITERAL;

			varRead.originalString = newValLiteral;
			cachedParseTree.tokenTypeChanged(varRead, ParseTreeTokenType.VARIABLE_READ);
		}
		makeCall.remove();
		cachedParseTree.tokensRemoved(toRemove);
		fixLogger.log(`Removed a call to ${makeCall.val} and substituted its value(${newVal}) to help the code execute faster.`, makeCall);
	});
};