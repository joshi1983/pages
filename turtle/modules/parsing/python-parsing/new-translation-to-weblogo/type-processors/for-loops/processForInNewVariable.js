import { getAllReservedIdentifiersAt } from '../../../parse-tree-analysis/getAllReservedIdentifiersAt.js';
import { getForLoopVarName } from './getForLoopVarName.js';
import { getInstructionsToken } from './getInstructionsToken.js';
import { getIteratorToken } from './getIteratorToken.js';
import { isTokenInAFunctionDefinition } from '../../../parse-tree-analysis/isTokenInAFunctionDefinition.js';
import { processToken } from '../processToken.js';

// Finds a variable name that won't be confused with an existing variable.
function getNewVariableName(token, elementVarName, cachedParseTree) {
	const prefix = elementVarName + '_';
	const allReservedNames = getAllReservedIdentifiersAt(token, cachedParseTree);
	if (!allReservedNames.has(prefix))
		return prefix;
	for (let i = 0;true;i++) {
		const newName = `${prefix}${i}`;
		if (!allReservedNames.has(newName))
			return newName;
	}
}

/*
Assumes isNeedingNewVariable returns true for token.
*/
export function processForInNewVariable(token, result, cachedParseTree) {
	const listOrTuple = getIteratorToken(token);
	const isInFunctionDefinition = isTokenInAFunctionDefinition(cachedParseTree, token);
	const makeCommand = isInFunctionDefinition ? 'localmake' : 'make';
	const elementVarName = getForLoopVarName(token);
	const newVarName = getNewVariableName(token, elementVarName, cachedParseTree);
	const instructionsToken = getInstructionsToken(token);
	result.append(`${makeCommand} "${newVarName} `);
	processToken(listOrTuple, result, cachedParseTree);
	result.append('\n');
	result.append(`repeat count :${newVarName} [\n`);
	result.append(`${makeCommand} "${elementVarName} item repcount :${newVarName}\n`);
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n]\n');
};