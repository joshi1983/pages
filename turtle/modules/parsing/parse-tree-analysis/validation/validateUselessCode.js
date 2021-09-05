/*
This is similar to validateIndependentlyUseful in that it looks for code that does nothing and should be removed or simplfied.
*/
import { Command } from '../../Command.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { isOutputBreakOrStopToken } from '../isOutputBreakOrStopToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function containsParameterRead(token, parameterNameSet) {
	let tokens = getDescendentsOfType(token, ParseTreeTokenType.VARIABLE_READ);
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		tokens.push(token);
	tokens = tokens.filter(varReadToken => parameterNameSet.has(varReadToken.val.toLowerCase()));
	return tokens.length !== 0;
}

// Tokens that never or are extremely unlikely to ever run should get warnings instead of errors.
function isWarningOnlyToken(cachedParseTree, token) {
	const parent = token.parentNode;
	if (parent === null)
		return false;
	if (token.previousSibling !== null && isOutputBreakOrStopToken(token.previousSibling))
		return true;
	if (parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(parent.val);
		if (info.primaryName === 'if') {
			const index = parent.children.indexOf(token);
			if (index === 1) {
				const conditionValue = cachedParseTree.getTokenValues().get(parent.children[0]);
				if (conditionValue === false)
					return true;
			}
		}
		else if (info.primaryName === 'ifelse') {
			const index = parent.children.indexOf(token);
			if (index >= 1) {
				const conditionValue = cachedParseTree.getTokenValues().get(parent.children[0]);
				if (typeof conditionValue === 'boolean') {
					if (conditionValue === false && index === 1)
						return true;
					if (conditionValue === true && index === 2)
						return true;
				}
			}
		}
	}
	return isWarningOnlyToken(cachedParseTree, parent);
}

function processParameterizedGroup(cachedParseTree, token, parseLogger, tokenValues) {
	const info = Command.getCommandInfo(token.val);
	if (info !== undefined) {
		const procedure = cachedParseTree.getProcedureAtToken(token);
		let parameterNameSet;
		if (procedure === undefined)
			parameterNameSet = new Set();
		else
			parameterNameSet = new Set(procedure.parameters);
		token.children.forEach(function(childToken, index) {
			if (index < info.args.length) {
				// We don't want to warn about constants for expressions that read a parameter.
				// We don't because parameters aren't constants from the programmer's perspective.
				// They might be treated as constants by WebLogo's compiler optimization process but 
				// warnings and error messages related to that would confuse most programmers more than help them.
				if (containsParameterRead(childToken, parameterNameSet))
					return;
				const arg = info.args[index];
				const val = tokenValues.get(childToken);
				// if childToken contains a parameter 
				if (arg.uselessCases !== undefined) {
					if (arg.uselessCases.indexOf(val) !== -1)
						parseLogger.warn('A constant value of ' + val + ' for input \'' + arg.name +
					'\' makes the \'' + info.primaryName + '\' command do nothing.  Consider removing or simplifying the code', childToken);
				}
				if (arg.errorCases !== undefined) {
					if (arg.errorCases.indexOf(val) !== -1) {
						let method = 'error';
						if (isWarningOnlyToken(cachedParseTree, token))
							method = 'warn';
						parseLogger[method]('A constant value of ' + val + ' for input \'' + arg.name + '\' would cause an error with the the \'' + info.primaryName + '\' command.', childToken);
					}
				}
			}
		});
	}
}

export function validateUselessCode(cachedParseTree, parseLogger) {
	const tokenValues = cachedParseTree.getTokenValues();
	getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
	filter(token => token.children.length !== 0).
	forEach(function(token) {
		processParameterizedGroup(cachedParseTree, token, parseLogger, tokenValues);
	});
};