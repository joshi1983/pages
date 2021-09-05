import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { getSortedLastDescendentTokenOf } from '../../../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { isStrictlyAfter } from '../../../../../generic-parsing-utilities/isStrictlyAfter.js';
import { isVariableAssignment } from './isVariableAssignment.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

function isAfter(beforeToken) {
	return function(token) {
		return isStrictlyAfter(token, beforeToken);
	};
}

/*
Checks if token is the string literal for a WebLogo variable name in a make or localmake call like:
context.make("x", x)
or
context.localmake("x", x)
You can optionally specify jsVariableNameToReadFrom to make this a more strict check.

Note that the value of the string literal and JavaScript variable name will be the same most of the time 
but not always so this function won't check that they're equal.
*/
export function mayBeFinalVariableAssignment(token, jsVariableNameToReadFrom) {
	if (!isVariableAssignment(token))
		return false;
	const argList = token.type === ParseTreeTokenType.STRING_LITERAL ? token.parentNode : token.children[1];
	if (argList.children.length !== 5)
		return false;
	const valueAssignedToken = argList.children[argList.children.length - 2];
	if (valueAssignedToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (typeof jsVariableNameToReadFrom === 'string' && (
	valueAssignedToken.type !== ParseTreeTokenType.IDENTIFIER ||
	valueAssignedToken.val !== jsVariableNameToReadFrom))
		return false;
	if (token.parentNode.type === ParseTreeTokenType.TREE_ROOT) {
		/*
		Look for anything that might be reading the JavaScript variable after token finishes assigning its new value.
		*/
		let lastToken = getSortedLastDescendentTokenOf(token);
		const tokensAfter = flatten(token).filter(t => t.type === ParseTreeTokenType.IDENTIFIER &&
		(jsVariableNameToReadFrom === undefined || t.val === jsVariableNameToReadFrom)).
			filter(isAfter(lastToken));
		if (tokensAfter.length !== 0) // if anything is found, return false because the new value might be read.
			return false;
	}
	return true;
};