import { filterBracketsAndCommas } from
'../type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { StringBuffer } from
'../../../../StringBuffer.js';

function isOfInterest(token) {
	if (token.children.length === 0)
		return false;
	const argList = token.parentNode;
	if (argList.type !== ParseTreeTokenType.ARG_LIST)
		return false;

	const funcCall = argList.parentNode;
	if (funcCall.type !== ParseTreeTokenType.FUNC_CALL)
		return false;

	const info = MigrationInfo.getFunctionInfo(funcCall);
	if (info === undefined || info.args === undefined)
		return false;

	const argValueTokens = filterBracketsAndCommas(argList.children);
	if (argValueTokens.length !== info.args.length)
		return false; 
		// There are likely too many problems with the function call to be worth fixing it automatically.

	const argIndex = argValueTokens.indexOf(token);
	if (argIndex === -1 || info.args[argIndex].types !== 'String')
		return false; // we want to be confident that converting to a string literal won't break more than it fixes.

	const s = getStringFromIdentifierList(token);
	if (s === undefined)
		return false;
	return true;
}

function getStringFromIdentifierList(token) {
	const result = new StringBuffer();
	while (token !== undefined) {
		if (token.type !== ParseTreeTokenType.IDENTIFIER)
			return; // indicate not suitable.

		result.append(token.val + ' ');
		const children = token.children;
		if (children.length > 1)
			return; // indicate not suitable.
		token = children[0];
	}
	return result.toString().trim();
}

export function quoteStringsFixer(root) {
	const idTokens = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).filter(isOfInterest);
	idTokens.forEach(function(idToken) {
		const s = getStringFromIdentifierList(idToken);
		idToken.val = '"' + s + '"';
		idToken.type = ParseTreeTokenType.STRING_LITERAL;
		idToken.children[0].remove();
	});
	return idTokens.length !== 0;
}