import { declarationTypes } from
'../../parsing/isCompleteWithNext.js';
import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { getClosestOfTypes } from
'../../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
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

function shouldBeLocal(token) {
	const f = getClosestOfTypes(token, [
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.PROCEDURE]);
	if (f === null)
		return false;
	
	// FIXME: if variableName is not a parameter and not declared, should it be global?

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
		result.append(`\n${makeCommand} ${valueToLiteralCode(variableNames[0])} `);
		processToken(rightChild, result);
	}
};