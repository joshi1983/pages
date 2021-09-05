import { QBasicInternalFunctions } from '../../QBasicInternalFunctions.js';
import { processToken } from './processToken.js';

export function processFunctionCall(token, result) {
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
	}
	else
		result.append(' ' + firstChild.val + ' ');
	processToken(argList, result);
};