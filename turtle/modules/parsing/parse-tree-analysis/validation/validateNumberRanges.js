import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { getDescendentsOfTypes } from '../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { isInstructionList } from '../isInstructionList.js';
import { isOutputOrStopToken } from '../isOutputOrStopToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { randomPrimaryNames } from '../randomPrimaryNames.js';

function containsOutputOrStop(token) {
	return getDescendentsOfTypes(token, [ParseTreeTokenType.PARAMETERIZED_GROUP]).some(isOutputOrStopToken);
}

function veryLikelyExecutes(cachedParseTree, token) {
	if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD ||
	token.type === ParseTreeTokenType.TREE_ROOT)
		return true;
	const parentToken = token.parentNode;
	if (parentToken.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return true;
	if (isInstructionList(parentToken)) {
		const childIndex = parentToken.children.indexOf(token);
		for (let i = 0; i < childIndex; i++) {
			if (containsOutputOrStop(parentToken.children[i]))
				return false;
		}
	}
	const tokenValues = cachedParseTree.getTokenValues();
	if (parentToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(parentToken.val);
		if (info !== undefined) {
			const childIndex = parentToken.children.indexOf(token);
			if (info.primaryName === 'if') {
				if (childIndex !== 0) {
					const condition = tokenValues.get(parentToken.children[0]);
					if (condition === false)
						return false;
				}
			}
			else if (info.primaryName === 'ifelse') {
				if (childIndex === 0)
					return veryLikelyExecutes(cachedParseTree, parentToken);
				const condition = tokenValues.get(parentToken.children[0]);
				if (childIndex === 1) {
					if (condition === false)
						return false;
				}
				else if (childIndex === 2) {
					if (condition === true)
						return false;
				}
			}
		}
	}
	return veryLikelyExecutes(cachedParseTree, parentToken);
}

function mightNotBeConstant(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return true;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return true; // a procedure might not return a constant.
	if (randomPrimaryNames.has(info.primaryName))
		return true;
	return false;
}

function tokenShouldUseError(cachedParseTree, token) {
	if (!getDescendentsOfTypes(token, [ParseTreeTokenType.VARIABLE_READ, ParseTreeTokenType.PARAMETERIZED_GROUP]).some(mightNotBeConstant))
		return true;
	return veryLikelyExecutes(cachedParseTree, token);
}

export function validateNumberRanges(cachedParseTree, parseLogger) {
	const commandTokens = cachedParseTree.getCommandCallsArray().filter(function(token) {
		if (token.children.length === 0)
			return false;
		const info = Command.getCommandInfo(token.val);
		for (let i = Math.min(token.children.length, info.args.length) - 1; i >= 0; i--) {
			const arg = info.args[i];
			if (arg.min !== undefined || arg.max !== undefined)
				return true;
		}
		return false;
	});
	const tokenValues = cachedParseTree.getTokenValues();
	commandTokens.forEach(function(token) {
		const messageKey = tokenShouldUseError(cachedParseTree, token) ? 'error' : 'warn';
		const info = Command.getCommandInfo(token.val);
		info.args.forEach(function(arg, index) {
			if (token.children.length > index) {
				const v = tokenValues.get(token.children[index]);
				if (typeof v === 'number' && !isNaN(v)) {
					let extra = '';
					if (typeof arg.name === 'string') {
						extra = ` for parameter ${arg.name} in command ${token.val}`;
					}
					if (arg.min !== undefined && arg.min > v)
						parseLogger[messageKey]('The minimum is ' + arg.min + ' but you are inputting ' + v + extra, token.children[index]);
					if (arg.max !== undefined && arg.max < v)
						parseLogger[messageKey]('The maximum is ' + arg.max + ' but you are inputting ' + v + extra, token.children[index]);
				}
			}
		});
	});
};