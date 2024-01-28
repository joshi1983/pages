import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getForLoopVarName } from './getForLoopVarName.js';
import { getIteratorToken } from './getIteratorToken.js';
import { getInstructionsToken } from './getInstructionsToken.js';
import { getRangeStopValueToken } from './getRangeStopValueToken.js';
import { getStartToken } from './getStartToken.js';
import { getStartValue } from './getStartValue.js';
import { getStepToken } from './getStepToken.js';
import { isRangeCall } from './isRangeCall.js';
import { isVariableReadInLoop } from './isVariableReadInLoop.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../../processToken.js';

const acceptableStartParseTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function isForRangeWithVariableStop(forToken) {
	const iteratorToken = getIteratorToken(forToken);
	const parameterValueTokens = filterBracketsAndCommas(iteratorToken.children);
	if (!isRangeCall(iteratorToken))
		return false;
	if (parameterValueTokens.length === 1 &&
		parameterValueTokens[0].type !== ParseTreeTokenType.NUMBER_LITERAL &&
		acceptableStartParseTypes.has(parameterValueTokens[0].type))
		return true;
	if (parameterValueTokens.length === 2 &&
		acceptableStartParseTypes.has(parameterValueTokens[0].type) &&
		parameterValueTokens[1].type === ParseTreeTokenType.IDENTIFIER)
		return true;
	if (parameterValueTokens.length === 3 &&
		acceptableStartParseTypes.has(parameterValueTokens[0].type) &&
		parameterValueTokens[1].type !== ParseTreeTokenType.NUMBER_LITERAL &&
		parameterValueTokens[2].type === ParseTreeTokenType.NUMBER_LITERAL)
		return true;
	return false;
};

function isOneLiteral(token) {
	return (token.type === ParseTreeTokenType.NUMBER_LITERAL) &&
		['1', '1.0'].indexOf(token.val) !== -1;
}

function isStartTokenANumber(forLoopToken) {
	const startToken = getStartToken(forLoopToken);
	if (startToken === undefined)
		return true;
	return startToken.type === ParseTreeTokenType.NUMBER_LITERAL;
}

function handleWithFor(iteratingVarName, token, result, cachedParseTree) {
	const rangeVariableToken = getRangeStopValueToken(token);
	const instructionsToken = getInstructionsToken(token);
	const startToken = getStartToken(token);
	const stepToken = getStepToken(token);
	result.append(`\nfor ["${iteratingVarName} `);
	if (startToken === undefined)
		result.append('0');
	else
		processToken(startToken, result, cachedParseTree);
	result.append(' ');
	processToken(rangeVariableToken, result, cachedParseTree);
	if (stepToken === undefined || isOneLiteral(stepToken)) {
		if (result.endsWithAndNotAcomment('+ 1'))
			result.removeFromTail('+ 1'.length);
		else
			result.append(' - 1');
	}
	else if (stepToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		result.append(' - ');
		processToken(stepToken, result, cachedParseTree);
	}
	else {
		result.append(' - (');
		processToken(stepToken, result, cachedParseTree);
		result.append(')');
	}
	if (stepToken !== undefined && (stepToken.val !== '1' ||
	stepToken.type !== ParseTreeTokenType.NUMBER_LITERAL)) {
		result.append(' ');
		processToken(stepToken, result, cachedParseTree);
	}
	result.append(`] [\n`);
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n]\n');
}

function handleWithRepeat(token, result, cachedParseTree) {
	const rangeVariableToken = getRangeStopValueToken(token);
	const instructionsToken = getInstructionsToken(token);
	const rangeVarName = rangeVariableToken.val;
	const startValue = getStartValue(token);
	result.append(`\nrepeat :${rangeVarName}`);
	if (startValue !== 0)
		result.append(` - ${startValue}`);
	result.append(` [\n`);
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n]\n');
}

export function processForRangeWithVariableStop(forToken, result, cachedParseTree) {
	const variableName = getForLoopVarName(forToken);
	if (isVariableReadInLoop(variableName, forToken) || !isStartTokenANumber(forToken)) {
		handleWithFor(variableName, forToken, result, cachedParseTree);
	}
	else {
		handleWithRepeat(forToken, result, cachedParseTree);
	}
};