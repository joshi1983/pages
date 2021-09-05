import { PBasicInternalFunctions } from
'../../PBasicInternalFunctions.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';
import { processToken } from
'../../../qbasic/translation-to-weblogo/type-processors/processToken.js';

export function isApplicableTo(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;

	const children = token.children;
	if (children.length !== 2)
		return false;

	const nameToken = children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.children.length !== 0)
		return false;

	const info = PBasicInternalFunctions.getFunctionInfo(nameToken.val);
	if (info !== undefined) {
		if (info.to !== undefined || info.toProc !== undefined ||
		info.removeInMigration === true)
			return true;
	}
	return false;
};

export function processFunctionCall(token, result, options) {
	const children = token.children;
	const nameToken = children[0];
	const info = PBasicInternalFunctions.getFunctionInfo(nameToken.val);
	if (info.removeInMigration === true)
		return;
	if (info.to !== undefined)
		result.append(info.to);
	else if (info.toProc !== undefined) {
		result.append(info.toProc);
	}
	const args = children[1].children;
	for (const child of args) {
		processToken(child, result, options);
	}
};