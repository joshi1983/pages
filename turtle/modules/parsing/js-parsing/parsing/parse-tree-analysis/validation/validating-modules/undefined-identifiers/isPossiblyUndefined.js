import { definingParentTypesOfInterest } from './definingParentTypesOfInterest.js';
import { getClosestOfType } from '../../../../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';
import { predefined } from './predefined.js';
import { SetUtils } from '../../../../../../../SetUtils.js';

const undefinedParentTypesNotOfInterest = new Set([
ParseTreeTokenType.DOT,
ParseTreeTokenType.EXPRESSION_DOT,
]);
SetUtils.addAll(undefinedParentTypesNotOfInterest, definingParentTypesOfInterest);

export function isPossiblyUndefined(token) {
	if (predefined.has(token.val))
		return false;
	const parent = token.parentNode;
	if (parent === null)
		return false;
	if (undefinedParentTypesNotOfInterest.has(parent.type))
		return false;
	if (parent.type === ParseTreeTokenType.CLASS_BODY &&
	token.children.length === 2) {
		return false;
	}
	if (parent.type === ParseTreeTokenType.ARG_LIST) {
		const grandParent = parent.parentNode;
		if (grandParent !== null) {
			if (grandParent.type === ParseTreeTokenType.FUNCTION ||
			grandParent.type === ParseTreeTokenType.IDENTIFIER ||
			grandParent.type === ParseTreeTokenType.CATCH)
				return false;
		}
	}
	if (token.val === 'super') {
		const classBody = getClosestOfType(parent, ParseTreeTokenType.CLASS_BODY);
		return classBody === null;
	}
	else if (token.val === 'arguments') {
		const functionToken = getClosestOfType(parent, ParseTreeTokenType.FUNCTION);
		if (functionToken !== null)
			return false;
		const methodNameToken = getClosestOfType(parent, ParseTreeTokenType.IDENTIFIER);
		if (methodNameToken !== null && methodNameToken.children.length === 2) {
			return false;
		}
	}
	return true;
};