import { PBasicInternalFunctions } from
'../../PBasicInternalFunctions.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

export function isApplicableTo(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.FUNCTION_CALL)
		return false;

	const info = PBasicInternalFunctions.getFunctionInfo(token.val);
	if (info !== undefined) {
		if (info.removeInMigration === true)
			return true;
	}
	return false;
};

export function processIdentifier(token, result, options) {
};