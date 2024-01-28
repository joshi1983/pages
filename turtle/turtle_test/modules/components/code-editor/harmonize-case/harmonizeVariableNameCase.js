import { ArrayUtils } from '../../../ArrayUtils.js';
import { Command } from '../../../parsing/Command.js';
import { getBestCaseFromTokens } from './getBestCaseFromTokens.js';
import { isMutationCommand } from '../../../parsing/parse-tree-analysis/variable-data-types/isMutationCommand.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function isVariableReference(argInfo, commandInfo, argIndex) {
	if (typeof argInfo.refTypes === 'string')
		return true;
	if (argIndex === 0 && 
	(commandInfo.primaryName === 'make' || commandInfo.primaryName === 'localmake'))
		return true;

	return false;
}

function getAssignedVariables(parseTree) {
	const mutations = parseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(function(token) {
			const info = Command.getCommandInfo(token.val);
			if (info === undefined)
				return false;
			return isMutationCommand(info);
		});
	const result = [];
	mutations.forEach(function(mutationCall) {
		const info = Command.getCommandInfo(mutationCall.val);
		const argCount = Command.getArgCount(info);
		const numArgs = Math.min(mutationCall.children.length, argCount.defaultCount);
		for (let i = 0; i < numArgs; i++) {
			const argInfo = info.args[i];
			if (typeof mutationCall.children[i].val === 'string' && isVariableReference(argInfo, info, i)) {
				result.push(mutationCall.children[i]);
			}
		}
	});
	return result;
}

function getVariableReads(parseTree) {
	return parseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ);
}

export function harmonizeVariableNameCase(parseTree) {
	const variables = new Map();
	const assignedVariables = getAssignedVariables(parseTree);
	const varReads = getVariableReads(parseTree);
	const allVarTokens = [];
	ArrayUtils.pushAll(allVarTokens, assignedVariables)
	ArrayUtils.pushAll(allVarTokens, varReads);
	allVarTokens.forEach(function(token) {
		const name = token.val.toLowerCase();
		let variable = variables.get(name);
		if (variable === undefined)
			variables.set(name, [token]);
		else
			variable.push(token);
	});
	// select best variable names and change all references to match.
	for (const variable of variables.values()) {
		// which of the cases has the largest value?
		const bestCase = getBestCaseFromTokens(variable);
		variable.forEach(function(referenceToken) {
			referenceToken.val = bestCase;
			if (referenceToken.originalString !== undefined)
				referenceToken.originalString = bestCase;
		});
	}
};