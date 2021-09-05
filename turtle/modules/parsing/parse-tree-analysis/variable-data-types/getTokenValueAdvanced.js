import { BinaryOperatorInstruction } from '../../execution/instructions/BinaryOperatorInstruction.js';
import { Command } from '../../Command.js';
import { compareParseTokens } from '../compareParseTokens.js';
import { getCommandGroups } from '../../../command-groups/getCommandGroups.js';
import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { Operators } from '../../Operators.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { UnaryOperatorInstruction } from '../../execution/instructions/UnaryOperatorInstruction.js';
await Command.asyncInit();
await Operators.asyncInit();

const commandGroups = getCommandGroups(undefined);

export function getTokenValueAdvanced(token, tokenValueMap, variables) {
	if (tokenValueMap.has(token))
		return tokenValueMap.get(token);
	if (token.type === ParseTreeTokenType.VARIABLE_READ && variables !== undefined) {
		const variable = variables.getVariableByName(token.val.toLowerCase());
		if (variable !== undefined) {
			const procedure = getProcedureFromAnyTokenInProcedure(token);
			const scopes = variable.getScopesAt(token, procedure);
			if (scopes.length === 1) {
				const scope = scopes[0];
				if (scope.isSingleValueApplicableAt(token, procedure))
					return scope.singleValue;
			}
		}
	}
	else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			const argCount = Command.getArgCount(info);
			if ((token.parentNode.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION || !argCount.isFlexible) &&
			token.children.length !== argCount.defaultCount)
				return; // don't continue when argument count is invalid.
			const argValues = [];
			for (let i = 0; i < token.children.length; i++) {
				const child = token.children[i];
				const val = tokenValueMap.get(child);
				if (val !== undefined && val !== null)
					argValues.push(val);
				else
					break;
			}
			if (argValues.length === token.children.length) {
				try {
					return commandGroups.get(info.commandGroup)[info.primaryName](...argValues);
				}
				catch (e) {
					// If an error is thrown trying to evaluate, just ignore it.
				}
			}
		}
	}
	else if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		const nonBrackets = token.children.filter(t => !t.isBracket());
		if (nonBrackets.length === 1 && tokenValueMap.has(nonBrackets[0]))
			return tokenValueMap.get(nonBrackets[0]);
	}
	else if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (token.children.length === 2) {
			const vals = [];
			for (let i = 0; i < 2; i++) {
				const val = tokenValueMap.get(token.children[i]);
				if (val === undefined)
					return;
				else
					vals.push(val);
			}
			return BinaryOperatorInstruction.evaluate(token.val, vals[0], vals[1]);
		}
	}
	else if (token.type === ParseTreeTokenType.UNARY_OPERATOR) {
		if (token.children.length === 1) {
			const val = tokenValueMap.get(token.children[0]);
			if (val !== undefined)
				return UnaryOperatorInstruction.evaluate(token.val, val);
		}
	}
	else if (token.type === ParseTreeTokenType.LIST) {
		const nonBrackets = token.children.filter(t => !t.isBracket());
		const childValues = [];
		for (let i = 0; i < nonBrackets.length; i++) {
			const child = nonBrackets[i];
			if (tokenValueMap.has(child))
				childValues.push(tokenValueMap.get(child));
			else
				break;
		}
		if (childValues.length === nonBrackets.length)
			return childValues;
	}
};