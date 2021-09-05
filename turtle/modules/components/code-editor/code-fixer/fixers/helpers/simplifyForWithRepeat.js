import { Command } from
'../../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getTokenValueBasic } from
'../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { getClosestOfType } from
'../../../../../parsing/generic-parsing-utilities/getClosestOfType.js';
import { insertColIndexSpanAt } from
'../../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { isNumber } from
'../../../../../isNumber.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from
'../../../../../parsing/Procedure.js';

function getInitialValue(settings) {
	const initToken = settings.children[2];
	return getTokenValueBasic(initToken);
}

function getSentinalValue(settings) {
	const sentinalToken = settings.children[3];
	return getTokenValueBasic(sentinalToken);
}

function getStepValue(settings) {
	const stepToken = settings.children[4];
	if (settings.children.length === 5)
		return 1;
	const val = getTokenValueBasic(stepToken);
	if (isNumber(val))
		return val;
}

function isOfInterest(token) {
	if (token.children.length !== 2)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'for')
		return false;

	const procStart = getClosestOfType(token, ParseTreeTokenType.PROCEDURE_START_KEYWORD);
	if (procStart === null)
		return false;
	
	const settings = token.children[0];
	if (settings.type !== ParseTreeTokenType.LIST ||
	settings.children.length < 5)
		return false;
		
	const initValue = getInitialValue(settings);
	if (!isNumber(initValue))
		return false;

	const sentinalValue = getSentinalValue(settings);
	if (!isNumber(sentinalValue))
		return false;

	const stepValue = getStepValue(settings);
	if (!isNumber(stepValue) &&
	settings.children.length > 5)
		return false;

	const varNameToken = settings.children[1];
	if (!varNameToken.isStringLiteral())
		return false;

	const varName = varNameToken.val.toLowerCase();

	// Check if the variable might be read later in the procedure.
	let varReferences = getDescendentsOfType(procStart,
	ParseTreeTokenType.VARIABLE_READ).
	filter(t => t.val.toLowerCase() === varName &&
	!Procedure.isParameterToken(t));

	if (varReferences.length !== 0) {
		if (isNumber(stepValue) && stepValue !== 1)
			return false; 
			// expressions like (i + -1) * stepValue are too complicated.
			// If such an expression is needed, converting the for-loop to a repeat
			// is not overall simplifying the code.

		const varReads = new Set();
		getVariableReadsInToken(token.children[1], varName, varReads);
		varReferences = varReferences.filter(t => !varReads.has(t));
	}

	return varReferences.length === 0;
}

function convertSettingsToRepeatCount(forSettings, cachedParseTree) {
	const initValue = getInitialValue(forSettings);
	const sentinalValue = getSentinalValue(forSettings);
	const stepValue = getStepValue(forSettings);
	forSettings.type = ParseTreeTokenType.NUMBER_LITERAL;
	const range = 1 + Math.ceil((sentinalValue - initValue) / stepValue);
	forSettings.val = range;
	forSettings.originalString = '' + forSettings.val;
	const toRemove = getAllDescendentsAsArray(forSettings);
	forSettings.children = [];
	cachedParseTree.tokensRemoved(toRemove);
	cachedParseTree.tokenTypeChanged(forSettings, ParseTreeTokenType.LIST);
}

function getVariableReadsInToken(token, variableName, varReads) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ &&
	token.val.toLowerCase() === variableName) {
		varReads.add(token);
	}
	for (const child of token.children) {
		getVariableReadsInToken(child, variableName, varReads);
	}
}

function convertVariableReadsToRepcount(forToken, cachedParseTree) {
	const settings = forToken.children[0];
	const variableName = settings.children[1].val.toLowerCase();
	const initValue = getInitialValue(settings);
	let offsetVal = initValue - 1;
	const offsetOperator = offsetVal >= 0 ? '+' : '-';
	offsetVal = Math.abs(offsetVal);
	const varReads = new Set();
	getVariableReadsInToken(forToken.children[1], variableName, varReads);
	for (const varRead of varReads) {
		varRead.val = 'repcount';
		varRead.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		cachedParseTree.tokenTypeChanged(varRead, ParseTreeTokenType.VARIABLE_READ);
		if (offsetVal !== 0) {
			const offsetToken = new ParseTreeToken(offsetVal, null,
			varRead.lineIndex, varRead.colIndex + 2, ParseTreeTokenType.NUMBER_LITERAL);
			offsetToken.originalString = '' + offsetVal;
			insertColIndexSpanAt(varRead, 5);
			varRead.colIndex++;
			const offsetOperatorToken = new ParseTreeToken(offsetOperator, null,
			varRead.lineIndex, varRead.colIndex + 1, ParseTreeTokenType.BINARY_OPERATOR);
			const curvedBracketExpression = new ParseTreeToken(null, null,
			varRead.lineIndex, varRead.colIndex - 1, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
			varRead.parentNode.replaceChild(varRead, curvedBracketExpression);
			varRead.remove();
			offsetOperatorToken.appendChild(varRead);
			offsetOperatorToken.appendChild(offsetToken);
			const openBracket = new ParseTreeToken('(', null,
			varRead.lineIndex, varRead.colIndex - 1, ParseTreeTokenType.LEAF);
			const closeBracket = new ParseTreeToken(')', null,
			varRead.lineIndex, varRead.colIndex + 3, ParseTreeTokenType.LEAF);
			curvedBracketExpression.appendChild(openBracket);
			curvedBracketExpression.appendChild(offsetOperatorToken);
			curvedBracketExpression.appendChild(closeBracket);
			cachedParseTree.tokensAdded([openBracket, curvedBracketExpression, closeBracket,
				offsetOperatorToken, offsetToken]);
		}
	}
}

export function simplifyForWithRepeat(cachedParseTree, fixLogger) {
	const fors = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	fors.forEach(function(forToken) {
		const settings = forToken.children[0];
		convertVariableReadsToRepcount(forToken, cachedParseTree);
		convertSettingsToRepeatCount(settings, cachedParseTree);
		forToken.val = 'repeat';
		fixLogger.log(`Converted for to repeat because repeat is simpler and express the same.`, forToken);
	});
};