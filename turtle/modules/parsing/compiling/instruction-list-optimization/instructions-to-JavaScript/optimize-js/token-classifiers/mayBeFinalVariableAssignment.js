import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { isVariableAssignment } from './isVariableAssignment.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

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
	const argList = token.parentNode;
	if (argList.children.length !== 5)
		return false;
	const valueAssignedToken = argList.children[argList.children.length - 2];
	if (valueAssignedToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (typeof jsVariableNameToReadFrom === 'string' && valueAssignedToken.val !== jsVariableNameToReadFrom)
		return false;
	return true;
};