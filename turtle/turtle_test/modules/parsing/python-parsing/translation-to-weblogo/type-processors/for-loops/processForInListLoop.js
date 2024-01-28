import { getForLoopVarName } from './getForLoopVarName.js';
import { getIteratorToken } from './getIteratorToken.js';
import { getInstructionsToken } from './getInstructionsToken.js';
import { isTokenInAFunctionDefinition } from '../../../parse-tree-analysis/isTokenInAFunctionDefinition.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../../processToken.js';

export function isForVarInListLoop(forToken) {
	const varName = getForLoopVarName(forToken);
	if (typeof varName !== 'string')
		return false;
	const iteratorToken = getIteratorToken(forToken);
	return iteratorToken.type === ParseTreeTokenType.IDENTIFIER;
}

export function processForInListLoop(token, result, cachedParseTree) {
	const listOrTupleVarName = getIteratorToken(token).val;
	const elementVarName = getForLoopVarName(token);
	const isInFunctionDefinition = isTokenInAFunctionDefinition(cachedParseTree, token);
	const makeCommand = isInFunctionDefinition ? 'localmake' : 'make';
	const instructionsToken = getInstructionsToken(token);
	result.append(`\nrepeat count :${listOrTupleVarName} [\n`);
	result.append(`${makeCommand} "${elementVarName} item repcount :${listOrTupleVarName}\n`);
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n]\n');
};