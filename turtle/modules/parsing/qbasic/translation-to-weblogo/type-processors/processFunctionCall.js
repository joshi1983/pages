import { combineArgsIntoString } from './function-calls/combineArgsIntoString.js';
import { processSpecial } from './function-calls/processSpecial.js';
import { processToken } from './processToken.js';
import { QBasicInternalFunctions } from '../../QBasicInternalFunctions.js';

function shouldCombineArgsToString(info) {
	if (info === undefined)
		return false;
	if (info.primaryName === 'print')
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
	if (info !== undefined) {
		if (info.removeInMigration === true)
			return;
		if (info.migrateToCode !== undefined) {
			result.append(' ' + info.migrateToCode + ' ');
			return;
		}
		if (info.to !== undefined)
			result.append(info.to + ' ');
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

	result.append(' ');
};