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
import { translateRead } from './helpers/translateRead.js';
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

function shouldWrapTokenInBrackets(token) {
	const parent = token.parentNode;
	const parentChildren = parent.children;
	if (ParseTreeTokenType.BINARY_OPERATOR === parent.type) {
		if (parentChildren.indexOf(token) === 0)
			return true;
	}
	return false;
}

function isDirectlyInCodeBlock(token) {
	const parent = token.parentNode;
	return parent === null || parent.type === ParseTreeTokenType.TREE_ROOT ||
		parent.type === ParseTreeTokenType.CODE_BLOCK;
}

export function processFunctionCall(token, result, options) {
	if (processSpecial(token, result, options))
		return;
	const children = token.children;
	const firstChild = children[0];
	if (isArrayToken(firstChild, options)) {
		translateRead(token, result, options);
		return;
	}
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return; // give up on translating this without throwing an error.
	const argList = children[1];
	const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val.toLowerCase());
	let wrapInBrackets = shouldWrapTokenInBrackets(token);
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
			wrapInBrackets = wrapInBrackets || shouldWrapInBrackets(info, argList);
			if (wrapInBrackets)
				result.append(' ( ');
			result.append(info.to + ' ');
		}
		else if (info.toProc !== undefined) {
			if (wrapInBrackets)
				result.append(' ( ');
			result.append(info.toProc + ' ');
		}
		else if (info.removeCallTokenOnly !== true)
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