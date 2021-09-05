import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from '../QBasicInternalFunctions.js';

const tokenValsFunctionNames = new Set();
QBasicInternalFunctions.getAllFunctionsInfo().forEach(function(info) {
	if (info.args !== undefined && info.args.length === 1 &&
	info.args[0].tokenVals !== undefined) {
		tokenValsFunctionNames.add(info.primaryName.toLowerCase());
	}
});

export { tokenValsFunctionNames };

export function isArgListKeyword(prev, next) {
	if (prev.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const parent = prev.parentNode;
	if (parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;

	const nameToken = parent.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	!tokenValsFunctionNames.has(nameToken.val.toLowerCase()))
		return false;
	if (typeof next.val !== 'string')
		return false;

	const info = QBasicInternalFunctions.getFunctionInfo(nameToken.val.toLowerCase());
	if (info.argCount !== undefined && next.lineIndex > prev.lineIndex) {
		if (info.argCount.min === 0)
			return false;
	}
	const argInfo = info.args[0];
	return argInfo.tokenVals.indexOf(next.val.toLowerCase()) !== -1;
};