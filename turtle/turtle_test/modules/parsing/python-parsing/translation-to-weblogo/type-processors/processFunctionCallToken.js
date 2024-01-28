import { Command } from '../../../Command.js';
import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { getAllFunctionDefinitions } from '../../parse-tree-analysis/getAllFunctionDefinitions.js';
import { getConvertProcedureName } from './function-calls/getConvertProcedureName.js';
import { processArgInfo } from './function-calls/processArgInfo.js';
import { processCustomFunctionCall } from './function-calls/processCustomFunctionCall.js';
import { processSpecialFunctionCall } from './function-calls/processSpecialFunctionCall.js';
import { processToken } from '../processToken.js';
import { PythonFunctions } from '../../PythonFunctions.js';

function getCommandsMatchingParameterCount(commandNames, parameterCount) {
	return commandNames.
		filter(primaryName => {
			const info = Command.getCommandInfo(primaryName);
			return Command.getArgCount(info).defaultCount === parameterCount;
		});
}

function handleGroupArgsAsList(token, funcInfo, parameterValueTokens, result, convertProcedureName, cachedParseTree) {
	let functionName = funcInfo.translateToCommand;
	if (functionName === undefined) {
		const matchingCommandNames = getCommandsMatchingParameterCount(funcInfo.translateToCommands, 1);
		functionName = matchingCommandNames[0];
	}
	const commandInfo = Command.getCommandInfo(functionName);
	if (commandInfo.returnTypes === null) {
		result.processCommentsUpToToken(token);
		result.append('\n');
	}
	result.append(`${functionName} ${convertProcedureName}[`);
	for (let i = 0; i < parameterValueTokens.length; i++) {
		if (i !== 0)
			result.append(' ');
		processToken(parameterValueTokens[i], result, cachedParseTree);
	}
	result.append(']\n');
}

function matchesCustomFunction(functionName, cachedParseTree) {
	const customFunctions = getAllFunctionDefinitions(cachedParseTree);
	return customFunctions.some(f => f.name === functionName);
}

export function processFunctionCallToken(token, result, cachedParseTree) {
	let functionName = token.val;
	if (typeof functionName !== 'string')
		throw new Error(`functionName expected to be a string but got ${functionName}`);

	result.processCommentsUpToToken(token);
	if (processSpecialFunctionCall(token, result, cachedParseTree)) {
		return;
	}
	if (processCustomFunctionCall(token, result, cachedParseTree))
		return;
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	const funcInfo = PythonFunctions.getFunctionInfo(functionName);
	let convertProcedureName = '';
	if (funcInfo !== undefined && !matchesCustomFunction(functionName, cachedParseTree)) {
		convertProcedureName = getConvertProcedureName(funcInfo, token, cachedParseTree);
		if ((funcInfo.treatThreeArgsAsSingleColor === true && parameterValueTokens.length === 3) ||
		(funcInfo.groupTwoArgsAsList === true && parameterValueTokens.length === 2)) {
			handleGroupArgsAsList(token, funcInfo, parameterValueTokens, result, convertProcedureName, cachedParseTree);
			return;
		}
		if (funcInfo.translateToCommand === null)
			return; // don't translate to anything.
		if (typeof funcInfo.translateToCommand === 'string')
			functionName = funcInfo.translateToCommand;
		else if (funcInfo.translateToCommands !== undefined) {
			const parameterCount = parameterValueTokens.length;
			const matchingCommandNames = getCommandsMatchingParameterCount(funcInfo.translateToCommands, parameterCount);
			if (matchingCommandNames.length === 1)
				functionName = matchingCommandNames[0];
		}
		const commandInfo = Command.getCommandInfo(functionName);
		if (commandInfo !== undefined && commandInfo.returnTypes === null) {
			result.processCommentsUpToToken(token);
			result.append('\n');
		}
	}
	result.append(functionName);
	if (parameterValueTokens.length !== 0)
		result.append(' ');
	result.append(convertProcedureName);
	for (let i = 0; i < parameterValueTokens.length; i++) {
		const child = parameterValueTokens[i];
		if (i !== 0)
			result.append(' ');
		if (funcInfo !== undefined && funcInfo.args !== undefined && funcInfo.args.length > i) {
			const argInfo = funcInfo.args[i];
			processArgInfo(argInfo, result, cachedParseTree);
		}
		processToken(child, result, cachedParseTree);
	}
	result.append(' ');
};