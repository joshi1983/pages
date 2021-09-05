import { findTopFunctionCall } from './findTopFunctionCall.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { PythonFunctions } from '../PythonFunctions.js';

const blockingTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	// We don't want to ignore an assignment operator when translating something like:
	// var1 = xCor() from Python to WebLogo code.

	ParseTreeTokenType.PRINT
]);

function isBlockingPathToTopToken(token) {
	if (blockingTypes.has(token.type))
		return true;
	return false;
}

export function getClassNameForFunctionCall(functionCallToken) {
	const parent = functionCallToken.parentNode;
	if (parent.type !== ParseTreeTokenType.DOT)
		return;

	const grandParent = parent.parentNode;
	if (grandParent.type !== ParseTreeTokenType.IDENTIFIER)
		return;

	const className = grandParent.val;
	if (PythonFunctions.isRecognizableClassName(className))
		return className;
};

export function findTopTranslatableFunctionCall(token) {
	if (isBlockingPathToTopToken(token))
		return;
	const token2 = findTopFunctionCall(token);
	if (token2 === undefined || typeof token2.val !== 'string')
		return;

	const className = getClassNameForFunctionCall(token2);
	const info = PythonFunctions.getFunctionInfo(token2.val, className);
	if (info === undefined || (
	info.translateToCommand === null && info.migrateToCode === undefined))
		return;
	for (let t = token2; t !== null && t !== token; t = t.parentNode) {
		if (isBlockingPathToTopToken(t))
			return;
	}
	return token2;
};