import { declaringTypes } from '../../../../declaringTypes.js';
import { definingParentTypesOfInterest } from './definingParentTypesOfInterest.js';
import { getAllDescendentsAsArray } from '../../../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getClosestOfType } from '../../../../../../generic-parsing-utilities/getClosestOfType.js';
import { isPossiblyDefining } from './isPossiblyDefining.js';
import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';
import { predefined } from './predefined.js';
import { SetUtils } from '../../../../../../../SetUtils.js';

const undefinedParentTypesNotOfInterest = new Set([
ParseTreeTokenType.DOT,
ParseTreeTokenType.EXPRESSION_DOT,
]);
SetUtils.addAll(undefinedParentTypesNotOfInterest, definingParentTypesOfInterest);

/*
Looks for cases like this with the x variable:

const x = {
	'm': function() {
		if (Math.random() < 0.5)
			x.m();
		}
	}
};

In most situations where an expression's value is assigned to a variable, reading the variable in the right-side 
expression requires the variable to be declared another time before the variable declaration.

For example,
const x = 1 + x; // x must be declared and before the const for this to work.

If x is read within a function implementation in the right-side expression, it is not a problem, though
*/
function isDefiningItselfInFunctionImplementation(token) {
	const name = token.val;
	const codeBlock = getClosestOfType(token, ParseTreeTokenType.CODE_BLOCK);
	if (codeBlock === null)
		return false;
	let funcFound = false;
	for (token = codeBlock.parentNode; token !== null; token = token.parentNode) {
		if (token.type === ParseTreeTokenType.FUNCTION)
			funcFound = true;
		else if (token.parentNode !== null && token.parentNode.type === ParseTreeTokenType.BINARY_OPERATOR &&
		token.parentNode.val === '=>' &&
		token.parentNode.children.indexOf(token) === 1
		)
			funcFound = true;
		else if (declaringTypes.has(token.type)) {
			const descendents = getAllDescendentsAsArray(token.children[0]);
			const definingNames = new Set(descendents.filter(isPossiblyDefining).map(t => t.val));
			if (definingNames.has(name))
				return true;
		}
	}
	return false;
}

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
	if (isDefiningItselfInFunctionImplementation(token))
		return false;
	return true;
};