import { getCommandForPythonOperator } from './helpers/getCommandForPythonOperator.js';
import { isVariableLocalAtToken } from '../../parse-tree-analysis/isVariableLocalAtToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processMultiVariableAssignment } from './assignments/processMultiVariableAssignment.js';
import { processToken } from './processToken.js';
import { validateIdentifier } from '../../../parse-tree-analysis/validateIdentifier.js';

const typesSafeWithoutBrackets = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, // already wrapped in curved brackets
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
]);

function handleSetItem(token, result, cachedParseTree, settings) {
	processToken(token.children[0], result, cachedParseTree, settings);
	result.append(' ');
	processToken(token.children[1], result, cachedParseTree, settings);
}

function isSafeWebLogoIdentifier(s) {
	return validateIdentifier(s) === undefined;
}

function isSafeWithoutBrackets(token) {
	return typesSafeWithoutBrackets.has(token.type);
}

export function processAssignmentOperatorToken(token, result, cachedParseTree, settings) {
	if (token.children.length !== 2)
		return; // weird case but it is better to give up translating this than throw an exception.

	result.processCommentsUpToToken(token);
	const leftSide = token.children[0];
	const val = token.val;
	if (val === '=' &&
	leftSide.type === ParseTreeTokenType.SUBSCRIPT_EXPRESSION) {
		handleSetItem(token, result, cachedParseTree, settings);
		return;
	}
	const rightSide = token.children[1];
	result.append('\n');
	const varName = leftSide.val;
	const webLogoName = settings.identifierToWebLogo.get(leftSide.val);
	const isLocal = isVariableLocalAtToken(cachedParseTree, varName, token);
	const makeCommand = isLocal ? 'localmake' : 'make';
	if (leftSide.type === ParseTreeTokenType.IDENTIFIER &&
	isSafeWebLogoIdentifier(webLogoName)) {
		result.append(`${makeCommand} "${webLogoName} `);
		const binaryOperator = val.substring(0, val.length - 1);
		const commandName = getCommandForPythonOperator(binaryOperator);
		if (commandName !== undefined) {
			result.append(`${commandName} :${webLogoName} `);
		}
		else if (val === '//=')
			result.append(`int :${webLogoName} / `);
		else if (binaryOperator !== '')
			result.append(`:${webLogoName} ${binaryOperator} `);
		if (commandName !== undefined || (val === '=') || isSafeWithoutBrackets(rightSide)) {
			processToken(rightSide, result, cachedParseTree, settings);
		}
		else {
			// brackets to ensure order of operation performs the preceding 
			// +, - or whatever operation last.
			result.append('(');
			processToken(rightSide, result, cachedParseTree, settings);
			result.append(')');
		}
	}
	else {
		if (!processMultiVariableAssignment(token, result, cachedParseTree, isLocal, settings)) {
			result.append('; FIXME: translate this.  Use make or localmake somewhere:\n');
			processToken(token.children[0], result, cachedParseTree, settings);
			result.append(val);
			processToken(token.children[1], result, cachedParseTree, settings);
		}
	}
	result.append('\n');
};