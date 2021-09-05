import { canEvaluateToDataValue } from
'../../parsing/canEvaluateToDataValue.js';
import { declarationTypes } from
'../../parsing/isCompleteWithNext.js';
import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { shouldBeLocal } from
'./helpers/shouldBeLocal.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

function getVariableNames(token) {
	const children = token.children;
	const result = [];
	if (children.length === 2) {
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
			result.push(firstChild.val);
	}
	else if (children.length === 1) {
		const parent = token.parentNode;
		if (declarationTypes.has(parent.type)) {
			const declarationFirst = parent.children[0];
			if (declarationFirst.type === ParseTreeTokenType.COMMA_LIST) {
				for (const child of filterBracketsAndCommas(declarationFirst.children)) {
					if (child.type === ParseTreeTokenType.IDENTIFIER)
						result.push(child.val);
				}
			}
			else if (declarationFirst.type === ParseTreeTokenType.IDENTIFIER)
				result.push(declarationFirst.val);
		}
	}
	return result;
}

function isLikelyArrayIndexExpression(first) {
	if (first.type !== ParseTreeTokenType.FUNCTION_CALL ||
	first.children.length !== 2)
		return false;

	const nameToken = first.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.children.length !== 0)
		return false;

	const argList = first.children[1];
	const indexToken = filterBracketsAndCommas(argList.children)[0];
	if (indexToken === undefined ||
	!canEvaluateToDataValue(indexToken))
		return false;

	return true;
}

export function processAssignmentOperator(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length === 0) {
		result.append(`\n; Unable to translate assignment(${token.val})\n`);
		result.append(`; no assignment operands were found\n`);
		return;
	}
	else if (children.length === 2) {
		const first = children[0];
		const rightChild = children[1];
		if (isLikelyArrayIndexExpression(first)) {
			const argList = first.children[1];
			const indexToken = filterBracketsAndCommas(argList.children)[0];
			result.append(`\nsetItem `);
			processToken(indexToken, result);
			result.append(` ${valueToLiteralCode(first.children[0].val)} `);
			processToken(rightChild, result);
			result.append('\n');
			return;
		}
	}
	const variableNames = getVariableNames(token);
	if (children.length === 1) {
		if (variableNames.length !== 0) {
			// loop through the identifiers.
			for (const variableName of variableNames) {
				const makeCommand = shouldBeLocal(token) ? 'localmake' : 'make';
				result.append(`\n${makeCommand} ${valueToLiteralCode(variableName)} `);
				processToken(children[0], result);
			}
		}
		else {
			result.append(`\n; Unable to translate assignment.\n`);
			result.append(`; Only 1 operand found\n`);
		}
		return;
	}
	else if (variableNames.length === 1) {
		const rightChild = children[1];
		const makeCommand = shouldBeLocal(token) ? 'localmake' : 'make';
		const variableName = variableNames[0];
		result.append(`\n${makeCommand} ${valueToLiteralCode(variableName)} `);
		if (token.val === '+=' || token.val === '-=') {
			const incrementOperator = token.val[0];
			result.append(`:${variableName} ${incrementOperator} `);
		}
		processToken(rightChild, result);
	}
};