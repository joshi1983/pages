import { CommandCalls } from '../../CommandCalls.js';
import { getAllVariableAssigningTokens } from '../getAllVariableAssigningTokens.js';
import { processAssignmentToken } from '../processAssignmentToken.js';

export function addVariableAssignmentScopes(cachedParseTree, variables) {
	const tokens = getAllVariableAssigningTokens(cachedParseTree, variables);
	const nonMakeTokens = [];
	const makeTokens = [];
	tokens.forEach(function(tok) {
		if (CommandCalls.tokenMatchesPrimaryName(tok, 'make'))
			makeTokens.push(tok);
		else
			nonMakeTokens.push(tok);
	});
	nonMakeTokens.forEach(function(token) {
		processAssignmentToken(cachedParseTree, variables, token);
	});

	// Since 'make' can create global variables even when called within procedures, do it last.
	// Doing it last will help isLocalAssignmentToken return more accurate results.
	makeTokens.forEach(function(token) {
		processAssignmentToken(cachedParseTree, variables, token);
	});
};