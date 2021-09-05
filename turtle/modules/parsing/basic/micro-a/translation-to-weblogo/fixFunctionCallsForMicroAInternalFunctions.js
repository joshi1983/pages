import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { MicroAInternalFunctions } from
'../MicroAInternalFunctions.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../qbasic/ParseTreeTokenType.js';

function getArgCount(info) {
	if (info.argCount !== undefined) {
		const argCount = info.argCount;
		if (argCount.min !== undefined &&
		argCount.max !== undefined &&
		argCount.min !== argCount.max)
			return;
	}
	if (info.argCount === undefined) {
		if (info.args === undefined)
			return;
		return info.args.length;
	}
	return info.argCount.min;
}

function isOfInterest(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.FUNCTION_CALL)
		return false; // the name is already in a function call.
		// There is nothing to fix or convert.

	const info = MicroAInternalFunctions.getToQBFunctionInfo(token.val);
	if (info === undefined)
		return false; // not matching an internal function from Micro(A) BASIC

	const numArgs = getArgCount(info);
	if (numArgs === undefined)
		return false; // no way to know how many parameters to group.

	let next = token.getNextSibling();
	if (next === null) {
		return numArgs === 0;
	}
	for (let i = 0; i < numArgs; i++) {
		if (next === null)
			return false;

		if (i !== numArgs - 1) {
			next = next.getNextSibling();
			if (next === null || next.val !== ',')
				return false;
			
			next = next.getNextSibling();
		}
	}	
	return true;
}

export function fixFunctionCallsForMicroAInternalFunctions(root) {
	const tokens = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).filter(isOfInterest);
	tokens.forEach(function(token) {
		const info = MicroAInternalFunctions.getFunctionInfo(token.val);
		const numParameters = getArgCount(info);
		const funcCall = new ParseTreeToken(null, token.lineIndex, token.colIndex, ParseTreeTokenType.FUNCTION_CALL);
		const argList = new ParseTreeToken(null, token.lineIndex, token.colIndex + 1, ParseTreeTokenType.ARG_LIST);
		const originalParent = token.parentNode;
		for (let i = 0; i < numParameters; i++) {
			const next = token.getNextSibling();
			next.remove();
			argList.appendChild(next);
			if (i !== numParameters - 1) {
				const commaToken = token.getNextSibling();
				commaToken.remove();
				argList.appendChild(commaToken);
			}
		}
		originalParent.replaceChild(token, funcCall);
		funcCall.appendChild(token);
		funcCall.appendChild(argList);
	});
};