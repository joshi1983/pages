import { evaluateNumberLiteral } from
'../../../evaluation/evaluateNumberLiteral.js';
import { evaluateStringLiteralString } from
'../../../evaluation/evaluateStringLiteralString.js';
import { isArrayToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/isArrayToken.js';
import { getBaseIndexForArrayVariableAtToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/variables/getBaseIndexForArrayVariableAtToken.js';
import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { stringValueToWebLogoStringLiteral } from
'../../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

function arrayTokenToIndexToken(arrayToken) {
	const argList = arrayToken.children[1];
	if (argList.children.length === 1)
		return argList.children[0];
	for (const child of argList.children) {
		if (mightBeDataValue(child))
			return child;
	}
}

function processArrayRead(token, result, options) {
	const indexToken = arrayTokenToIndexToken(token);
	if (indexToken === undefined) {
		return; // give up on processing but do not throw an exception.
	}
	const arrayRefToken = token.children[0];
	result.append(' ( item ');
	const qbArrayName = arrayRefToken.val.toLowerCase();
	const baseIndex = getBaseIndexForArrayVariableAtToken(qbArrayName, indexToken, 0, options);
	if (indexToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		const index = evaluateNumberLiteral(indexToken);
		result.append('' + (index + 1 - baseIndex));
	}
	else {
		if (baseIndex !== 1) {
			result.append(`${1 - baseIndex} + `);
		}
		processToken(indexToken, result, options);
	}
	result.append(' ');
	if (arrayRefToken.type === ParseTreeTokenType.IDENTIFIER)
		result.append(`:${options.identifierRenameMap.get(qbArrayName)}`);
	else
		processToken(arrayRefToken, result, options);
	result.append(' ) ');
}

function processExpressionDot(token, result, options) {
	const children = token.children;
	if (children.length !== 3)
		return;

	const objectToken = children[0];
	const propertyToken = children[2];
	if (propertyToken.type !== ParseTreeTokenType.IDENTIFIER)
		return;

	const propertyName = options.identifierRenameMap.get(propertyToken.val.toLowerCase());
	if (objectToken.type !== ParseTreeTokenType.IDENTIFIER) {
		result.append(` getProperty2 ( `);
		processToken(objectToken, result, options);
		result.append(' ) "' + propertyName + ' ');
		return;
	}

	const objectName = options.identifierRenameMap.get(objectToken.val.toLowerCase());
	result.append(` getProperty "${objectName} "${propertyName} `);
}

export function translateRead(token, result, options) {
	if (typeof options !== 'object')
		throw new Error(`translateRead requires options to be an object but found ${options}`);
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		result.append(` :${options.identifierRenameMap.get(token.val.toLowerCase())} `);
	}
	else if (token.type === ParseTreeTokenType.STRING_LITERAL)
		result.append(stringValueToWebLogoStringLiteral(evaluateStringLiteralString(token.val)));
	else if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const firstChild = token.children[0];
		if (firstChild !== undefined && isArrayToken(firstChild, options))
			processArrayRead(token, result, options);
		else {
			
		}
	}
	else if (token.type === ParseTreeTokenType.EXPRESSION_DOT)
		processExpressionDot(token, result, options);
};