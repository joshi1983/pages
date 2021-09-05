import { combineArgsIntoString } from './function-calls/combineArgsIntoString.js';
import { Command } from
'../../../Command.js';
import { mightBeDataValue } from
'../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
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

export function processFunctionCall(token, result, options) {
	if (processSpecial(token, result, options))
		return;
	const children = token.children;
	const firstChild = children[0];
	const argList = children[1];
	const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val.toLowerCase());
	let wrapInBrackets = false;
	if (info !== undefined) {
		if (info.returnTypes === null)
			result.processCommentsUpToToken(token);
		if (info.removeInMigration === true)
			return;
		if (info.migrateToCode !== undefined) {
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