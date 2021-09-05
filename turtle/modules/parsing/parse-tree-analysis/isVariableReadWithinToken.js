import { CommandCalls } from './CommandCalls.js';
import { ForLoops } from './ForLoops.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isVariableReadWithinToken(varName, token) {
	if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return token.children.length > 2 && isVariableReadWithinToken(varName.toLowerCase(), token.children[2]);
	if (token.type === ParseTreeTokenType.VARIABLE_READ && token.val.toLowerCase() === varName)
		return true;
	// if the variable is mutated by the setProperty command,
	// this could affect a procedure caller so consider the variable read.
	if (token.isStringLiteral() && token.val.toLowerCase() === varName &&
	CommandCalls.tokenMatchesPrimaryName(token.parentNode, 'setProperty') &&
	token.parentNode.children.indexOf(token) === 0)
		return true;

	// look for for-loops using the same name.
	// Instructions reading from the for-loop variable don't count as using the parameter.
	// If a for-loop uses the same variable name but some other control setting calculates off the parameter value, that counts, though.
	if (ForLoops.isAForLoopToken(token)) {
		const forVariableName = ForLoops.getVariableName(token);
		if (forVariableName === varName)
			return isVariableReadWithinToken(varName, token.children[0]);
	}

	for (let i = 0; i < token.children.length; i++)
		if (isVariableReadWithinToken(varName, token.children[i]))
			return true;

	return false;
};