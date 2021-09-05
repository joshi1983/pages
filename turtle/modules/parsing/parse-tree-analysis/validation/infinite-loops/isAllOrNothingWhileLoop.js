import { canFindHaltingCommandForLoopToken } from './canFindHaltingCommandForLoopToken.js';
import { Command } from '../../../Command.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { isMutationCommand } from '../../variable-data-types/isMutationCommand.js';
import { mightBeVariableReference, refCommandNames } from
'../../variable-data-types/mightBeVariableReference.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { randomPrimaryNames } from '../../randomPrimaryNames.js';
import { SetUtils } from '../../../../SetUtils.js';
await Command.asyncInit();

const safeCommandNames = new Set();
Command.getAllCommandsInfo().filter(function(info) {
	if (info.commandGroup !== 'turtle')
		return true;
	return false;
}).forEach(function(info) {
	safeCommandNames.add(info.primaryName.toLowerCase());
});

function mightBeRandom(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return true; // procedure calls could be random.
	return randomPrimaryNames.has(info.primaryName);
}

function usesRandomCommandOrProcedure(condition) {
	const tokens = getDescendentsOfType(condition, ParseTreeTokenType.PARAMETERIZED_GROUP);
	if (condition.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		tokens.push(condition);
	return tokens.some(mightBeRandom);
}

function mightBeUnsafe(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return true;
	return !safeCommandNames.has(info.primaryName.toLowerCase());
}

function usesUnsafeConditionCommand(condition) {
	const tokens = getDescendentsOfType(condition, ParseTreeTokenType.PARAMETERIZED_GROUP);
	if (condition.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		tokens.push(condition);
	return tokens.some(mightBeUnsafe);
}

function getVariableReferenceTokens(token) {
	const result = getDescendentsOfTypes(token, [ParseTreeTokenType.VARIABLE_READ, ParseTreeTokenType.STRING_LITERAL]).filter(mightBeVariableReference);
	return result;
}

function mightBeMutatingVariableReference(varToken) {
	const parent = varToken.parentNode;
	if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(parent.val);
	if (info === undefined)
		return true;
	else if (isMutationCommand(info))
		return true;
	return false;
}

function mightCallProcedure(token) {
	const tokens = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		tokens.push(token);
	return tokens.some(t => Command.getCommandInfo(t.val) === undefined);
}

function includesGlobalVariable(varTokens, cachedParseTree) {
	const variables = cachedParseTree.getVariables();
	for (const varToken of varTokens) {
		const variable = variables.getVariableByName(varToken.val);
		if (variable !== undefined && variable.hasAGlobalScope())
			return true;
	}
	return false;
}

function mightMutate(token) {
	const tokens = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		tokens.push(token);
	for (const t of tokens) {
		const info = Command.getCommandInfo(t.val);
		if (info === undefined)
			return true;
		if (refCommandNames.has(info.primaryName.toLowerCase()))
			return true;
		else (isMutationCommand(info))
			return true;
	}
	return false;
}

export function isAllOrNothingWhileLoop(token, cachedParseTree) {
	if (token.children.length !== 2 || canFindHaltingCommandForLoopToken(token))
		return false;
	const condition = token.children[0];
	const conditionVal = cachedParseTree.getTokenValues().get(condition);
	if (conditionVal !== undefined)
		return false;
	// if depends on something random, return false.
	if (usesRandomCommandOrProcedure(condition))
		return false;
	if (mightMutate(condition))
		return false;
	const varTokens = getVariableReferenceTokens(condition);
	const vars = new Set(varTokens.map(token => token.val.toLowerCase()));
	const instructionListToken = token.children[1];
	const instructionVarTokens = new Set(getVariableReferenceTokens(instructionListToken).filter(mightBeMutatingVariableReference).map(token => token.val.toLowerCase()));
	if (SetUtils.isIntersecting(instructionVarTokens, vars))
		return false;
	if (usesUnsafeConditionCommand(condition))
		return false; // turtle commands like penSize in the condition can return different values if anything in the 
		// instruction list calls setPenSize, penNormal, setTurtleState...
	if (mightCallProcedure(instructionListToken) && includesGlobalVariable(varTokens, cachedParseTree))
		return false; // procedure might mutate global variable used in condition to end the loop.
	return true;
};