import { addDefaultParameterValues } from './helpers/addDefaultParameterValues.js';
import { Command } from '../../../Command.js';
import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { getAllFunctionDefinitions } from '../../parse-tree-analysis/getAllFunctionDefinitions.js';
import { getConvertProcedureName } from './function-calls/getConvertProcedureName.js';
import { isDefinitelyColorTypeArgument } from './function-calls/isDefinitelyColorTypeArgument.js';
import { mightBracketsBeImportantForParameters } from './function-calls/mightBracketsBeImportantForParameters.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processArgInfo } from './function-calls/processArgInfo.js';
import { processColorValueToken } from './processColorValueToken.js';
import { processCustomFunctionCall } from './function-calls/processCustomFunctionCall.js';
import { processSpecialFunctionCall } from './function-calls/processSpecialFunctionCall.js';
import { processToken } from './processToken.js';
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

function appendClosingBracket(result) {
	result.trimRight();
	result.append(' )');
}

function shouldBreakLine(token) {
	let functionName = token.val;
	const funcInfo = PythonFunctions.getFunctionInfo(functionName);
	if (funcInfo !== undefined) {
		if (funcInfo.returnTypes === null)
			return true;
		if (funcInfo.returnTypes !== undefined)
			return false;
		if (typeof funcInfo.translateToCommand === 'string' &&
		funcInfo.isTranslatedToProcedure !== true)
			functionName = funcInfo.translateToCommand;
	}
	const commandInfo = Command.getCommandInfo(functionName);
	if (commandInfo !== undefined)
		return commandInfo.returnTypes === null;
	return false;
}

export function processFunctionCallToken(token, result, cachedParseTree) {
	let functionName = token.val;
	if (typeof functionName !== 'string')
		throw new Error(`functionName expected to be a string but got ${functionName}`);

	result.processCommentsUpToToken(token);
	const argList = token.children[0];
	if (argList === undefined) {
		result.append(` ; FIXME: unable to translate function call to ${token.val} due to missing argument list\n`);
		return; // unable to translate.
	}
	const parameterValueTokens = filterBracketsAndCommas(argList.children);
	const useBrackets = mightBracketsBeImportantForParameters(token, parameterValueTokens);
	if (shouldBreakLine(token)) {
		result.processCommentsUpToToken(token);
		result.append('\n');
	}
	if (useBrackets)
		result.append('(');
	if (processSpecialFunctionCall(token, result, cachedParseTree)) {
		if (useBrackets)
			appendClosingBracket(result);
		return;
	}
	if (processCustomFunctionCall(token, result, cachedParseTree)) {
		if (useBrackets)
			appendClosingBracket(result);
		return;
	}
	const funcInfo = PythonFunctions.getFunctionInfo(functionName);
	let convertProcedureName = '';
	let translateInstanceToFirstArg = false;
	if (funcInfo !== undefined && !matchesCustomFunction(functionName, cachedParseTree)) {
		if (funcInfo.migrateToCode !== undefined) {
			result.append(` ${funcInfo.migrateToCode} `);
			return;
		}
		translateInstanceToFirstArg = funcInfo.translateInstanceToFirstArg;
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
	}
	result.append(functionName);
	if (parameterValueTokens.length !== 0 || translateInstanceToFirstArg)
		result.append(' ');
	result.append(convertProcedureName);
	if (translateInstanceToFirstArg &&
	token.parentNode.type === ParseTreeTokenType.DOT &&
	token.parentNode.parentNode.type === ParseTreeTokenType.IDENTIFIER) {
		result.append(':' + token.parentNode.parentNode.val + ' ');
	}
	for (let i = 0; i < parameterValueTokens.length; i++) {
		const child = parameterValueTokens[i];
		if (i !== 0)
			result.append(' ');
		if (funcInfo !== undefined && funcInfo.args !== undefined && funcInfo.args.length > i) {
			const argInfo = funcInfo.args[i];
			processArgInfo(argInfo, result, cachedParseTree);
		}
		if (isDefinitelyColorTypeArgument(functionName, i)) {
			processColorValueToken(child, result, cachedParseTree);
		}
		else if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && child.val === '=' &&
		child.children.length === 2) {
			// For example, f(x=4) where x is the name of a parameter from the function definition.
			processToken(child.children[1], result, cachedParseTree);
		}
		else
			processToken(child, result, cachedParseTree);
	}
	addDefaultParameterValues(functionName, parameterValueTokens.length, result, cachedParseTree);
	if (useBrackets)
		appendClosingBracket(result);
	result.append(' ');
};