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

function handleSetItem(token, result, cachedParseTree) {
	processToken(token.children[0], result, cachedParseTree);
	result.append(' ');
	processToken(token.children[1], result, cachedParseTree);
}

function isSafeWebLogoIdentifier(s) {
	return validateIdentifier(s) === undefined;
}

function isSafeWithoutBrackets(token) {
	return typesSafeWithoutBrackets.has(token.type);
}

export function processAssignmentOperatorToken(token, result, cachedParseTree) {
	if (token.children.length !== 2)
		return; // weird case but it is better to give up translating this than throw an exception.

	result.processCommentsUpToToken(token);
	const leftSide = token.children[0];
	const val = token.val;
	if (val === '=' &&
	leftSide.type === ParseTreeTokenType.SUBSCRIPT_EXPRESSION) {
		handleSetItem(token, result, cachedParseTree);
		return;
	}
	const rightSide = token.children[1];
	result.append('\n');
	const varName = leftSide.val;
	const isLocal = isVariableLocalAtToken(cachedParseTree, varName, token);
	const makeCommand = isLocal ? 'localmake' : 'make';
	if (leftSide.type === ParseTreeTokenType.IDENTIFIER &&
	isSafeWebLogoIdentifier(varName)) {
		result.append(`${makeCommand} "${varName} `);
		const binaryOperator = val.substring(0, val.length - 1);
		const commandName = getCommandForPythonOperator(binaryOperator);
		if (commandName !== undefined) {
			result.append(`${commandName} :${varName} `);
		}
		else if (val === '//=')
			result.append(`int :${varName} / `);
		else if (binaryOperator !== '')
			result.append(`:${varName} ${binaryOperator} `);
		if (commandName !== undefined || (val === '=') || isSafeWithoutBrackets(rightSide)) {
			processToken(rightSide, result, cachedParseTree);
		}
		else {
			// brackets to ensure order of operation performs the preceding 
			// +, - or whatever operation last.
			result.append('(');
			processToken(rightSide, result, cachedParseTree);
			result.append(')');
		}
	}
	else {
		if (!processMultiVariableAssignment(token, result, cachedParseTree, isLocal)) {
			result.append('; FIXME: translate this.  Use make or localmake somewhere:\n');
			processToken(token.children[0], result, cachedParseTree);
			result.append(val);
			processToken(token.children[1], result, cachedParseTree);
		}
	}
	result.append('\n');
};