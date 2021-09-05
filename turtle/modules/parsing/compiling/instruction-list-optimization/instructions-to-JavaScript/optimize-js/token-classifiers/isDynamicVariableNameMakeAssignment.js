import { isContextMakeCall } from './isContextMakeCall.js';
import { isGlobalVariablesSetCall } from './isGlobalVariablesSetCall.js';
import { isLocalmakeCall } from './isLocalmakeCall.js';
import { isLocalVariablesSetCall } from './isLocalVariablesSetCall.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

const nonValueTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
]);

function mightBeOfInterest(token) {
	if (isLocalVariablesSetCall(token) ||
	isGlobalVariablesSetCall(token) ||
	isLocalmakeCall(token) ||
	isContextMakeCall(token))
		return true;

	return false;
}

function getFirstArgumentValueToken(token) {
	let argListToken;
	if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		argListToken = token.children[1];
	}
	if (argListToken !== undefined && argListToken.children.length > 1) {
		let child = argListToken.children[1];
		if (nonValueTypes.has(child.type))
			return;
		return child;
	}
}

export function isDynamicVariableNameMakeAssignment(token) {
	if (!mightBeOfInterest(token))
		return false;
	const firstArgValueToken = getFirstArgumentValueToken(token);
	if (firstArgValueToken === undefined)
		return false;
	if (firstArgValueToken.type === ParseTreeTokenType.STRING_LITERAL)
		return false;
	return true;
};