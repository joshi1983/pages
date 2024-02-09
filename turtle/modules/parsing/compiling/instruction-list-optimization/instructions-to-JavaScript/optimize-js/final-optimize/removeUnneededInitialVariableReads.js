import { declaringTypes } from '../../../../../js-parsing/parsing/declaringTypes.js';
import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from '../../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isJSVariableAssignment } from '../token-classifiers/isJSVariableAssignment.js';
import { isJSVariableDeclareAssignment } from '../token-classifiers/isJSVariableDeclareAssignment.js';
import { parse } from '../../../../../js-parsing/parse.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { parseTreeTokensToCode } from '../../../../../js-parsing/parseTreeTokensToCode.js';

function isReadingVariableNamed(variableName) {
	return function(token) {
		if (token.type !== ParseTreeTokenType.IDENTIFIER ||
		token.val !== variableName)
			return false;
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.DOT)
			return false;
		if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
			return parent.children.indexOf(token) !== 0;
		}
		return true;
	};
}

function assignsNewValueWithoutReadingOldValue(token, varName) {
	if (token.val !== '=' || token.children.length !== 2)
		return false;
	const assignToToken = token.children[0];
	if (!isJSVariableAssignment(assignToToken))
		return false;
	if (assignToToken.val !== varName ||
	assignToToken.children.length !== 0)
		return false;
	return true;
}

function isOfInterest(token) {
	if (!declaringTypes.has(token.type))
		return false;
	const assignOperator = token.children[0];
	if (assignOperator.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
	assignOperator.children.length !== 2)
		return false;
	const varNameToken = assignOperator.children[0];
	if (!isJSVariableDeclareAssignment(varNameToken))
		return false;
	const tokenParent = token.parentNode;
	const children = tokenParent.children;
	for (let i = children.indexOf(token) + 1; i < children.length; i++) {
		const child = children[i];
		const allDescendents = getAllDescendentsAsArray(child);
		allDescendents.push(child);
		if (allDescendents.some(isReadingVariableNamed(varNameToken.val)))
			return false;
		if (assignsNewValueWithoutReadingOldValue(child, varNameToken.val))
			return true;
	}
	return true;
}

function removeAssignedValue(token) {
	const assignOperatorToken = token.children[0];
	const nameToken = assignOperatorToken.children[0];
	token.replaceChild(assignOperatorToken, nameToken);
}

export function removeUnneededInitialVariableReads(jsCode) {
	// avoid unnecessary parsing if we can quickly rule out its necessity.
	if (jsCode.indexOf('let ') === -1)
		return jsCode;
	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	const declarationsOfInterest = allTokens.filter(isOfInterest);
	if (declarationsOfInterest.length === 0)
		return jsCode;
	declarationsOfInterest.forEach(removeAssignedValue);
	return parseTreeTokensToCode(flatten(parseResult.root));
};