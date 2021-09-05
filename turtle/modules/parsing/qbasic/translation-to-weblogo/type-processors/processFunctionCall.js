import { combineArgsIntoString } from './function-calls/combineArgsIntoString.js';
import { Command } from
'../../../Command.js';
import { isArrayToken } from
'../../parsing/parse-tree-analysis/variable-data-types/isArrayToken.js';
import { mightBeDataValue } from
'../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processSpecial } from './function-calls/processSpecial.js';
import { processToken } from './processToken.js';
import { QBasicInternalFunctions } from '../../QBasicInternalFunctions.js';
await Command.asyncInit();

function shouldCombineArgsToString(info) {
	if (info === undefined)
		return false;
	if (info.primaryName === 'print')
		return true;
	return false;
}

function shouldWrapInBrackets(info, argList) {
	if (info === undefined || info.to === undefined)
		return false;
	const webLogoCommandInfo = Command.getCommandInfo(info.to);
	if (webLogoCommandInfo.argCount === undefined ||
	webLogoCommandInfo.argCount.min === webLogoCommandInfo.argCount.max)
		return false;
	const argValues = argList.children.filter(mightBeDataValue);
	if (webLogoCommandInfo.argCount.default !== undefined)
		return argValues.length !== webLogoCommandInfo.argCount.default;
	if (argValues.length !== webLogoCommandInfo.args.length)
		return true;
	return false;
}

function isDirectlyInCodeBlock(token) {
	const parent = token.parentNode;
	return parent === null || parent.type === ParseTreeTokenType.TREE_ROOT ||
		parent.type === ParseTreeTokenType.CODE_BLOCK;
}

function arrayTokenToIndexToken(arrayToken) {
	const argList = arrayToken.children[1];
	if (argList.children.length === 1)
		return argList.children[0];
	for (const child of argList.children) {
		if (mightBeDataValue(child))
			return child;
	}
}

function processArrayRead(token, result, options) {
	const indexToken = arrayTokenToIndexToken(token);
	const arrayRefToken = token.children[0];
	result.append(' item ');
	processToken(indexToken, result, options);
	result.append(' ');
	if (arrayRefToken.type === ParseTreeTokenType.IDENTIFIER)
		result.append(`:${options.identifierRenameMap.get(arrayRefToken.val.toLowerCase())}`);
	else
		processToken(arrayRefToken, result, options);
	result.append(' ');
}

export function processFunctionCall(token, result, options) {
	if (processSpecial(token, result, options))
		return;
	const children = token.children;
	const firstChild = children[0];
	if (isArrayToken(firstChild, options)) {
		processArrayRead(token, result, options);
		return;
	}
	const argList = children[1];
	const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val.toLowerCase());
	let wrapInBrackets = false;
	if (info !== undefined) {
		if (info.returnTypes === null || isDirectlyInCodeBlock(token))
			result.processCommentsUpToToken(token);
		if (info.removeInMigration === true)
			return;
		if (info.migrateToCode !== undefined) {
			if (info.removeWhenTopLevelInstruction && isDirectlyInCodeBlock(token))
				return;
			result.append(' ' + info.migrateToCode + ' ');
			return;
		}
		if (info.to !== undefined) {
			wrapInBrackets = shouldWrapInBrackets(info, argList);
			if (wrapInBrackets)
				result.append(' ( ');
			result.append(info.to + ' ');
		}
		else if (info.toProc !== undefined)
			result.append(info.toProc + ' ');
		else
			result.append(' ' + firstChild.val + ' ');
	}
	else
		result.append(' ' + firstChild.val + ' ');
	if (shouldCombineArgsToString(info))
		combineArgsIntoString(argList, result, options);
	else
		processToken(argList, result, options);

	if (wrapInBrackets)
		result.append(' ) ');
	result.append(' ');
};