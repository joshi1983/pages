import { countRepresentedParameterValues } from './parsing/countRepresentedParameterValues.js';
import { getLastDescendentTokenOf } from
'../../generic-parsing-utilities/getLastDescendentTokenOf.js';
import { isComplete } from
'./parsing/isComplete.js';
import { isPreprocessorIdentifier } from './scanning/isPreprocessorIdentifier.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { QBasicInternalFunctions } from './QBasicInternalFunctions.js';

const typesNotExpectingNumbers = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.DEF_PRIMITIVE,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_SUB,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.LOOP_WHILE,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.STEP,
	ParseTreeTokenType.SUB,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.WHILE
]);

function mightExpectNumber(prev) {
	const prevChildren = prev.children;
	if (prev.type === ParseTreeTokenType.ARG_LIST) {
		const lastChild = prevChildren[prevChildren.length - 1];
		if (lastChild !== undefined &&
		(lastChild.type === ParseTreeTokenType.NUMBER_LITERAL ||
		lastChild.type === ParseTreeTokenType.STRING_LITERAL))
			return false;
	}
	else if (prev.type === ParseTreeTokenType.IF) {
		return prevChildren.length <= 1;
	}
	else if (prev.type === ParseTreeTokenType.CASE) {
		return prev.children.length === 0;
	}
	else if (typesNotExpectingNumbers.has(prev.type))
		return false;
	return true;
}

function requiresAnotherArgument(argsToken) {
	const funcCallToken = argsToken.parentNode;
	if (funcCallToken.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const funcNameToken = funcCallToken.children[0];
	if (funcNameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const info = QBasicInternalFunctions.getFunctionInfo(funcNameToken.val);
	if (info === undefined)
		return false;
	const numValues = countRepresentedParameterValues(argsToken.children, info);
	if (info.argCount !== undefined &&
	info.argCount.min !== undefined) {
		if (info.argCount.min > numValues)
			return true;
	}
	else if (info.args !== undefined) {
		if (info.args.length > numValues)
			return true;
	}
	return false;
}

export function shouldBecomeLabel(prev, current, nextScanToken) {
	if (current.type !== ParseTreeTokenType.NUMBER_LITERAL &&
	current.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (isPreprocessorIdentifier(current.val))
		return false;
	if (current.type !== ParseTreeTokenType.NUMBER_LITERAL &&
	(nextScanToken === undefined || nextScanToken.s !== ':'))
		return false;
	if (prev.lineIndex === current.lineIndex &&
	prev.type !== ParseTreeTokenType.TREE_ROOT)
		return false;
	const lastDescendent = getLastDescendentTokenOf(prev);
	if (lastDescendent.lineIndex === current.lineIndex &&
	lastDescendent.type !== ParseTreeTokenType.TREE_ROOT)
		return false;
	if (current.type === ParseTreeTokenType.NUMBER_LITERAL) {
		if (prev.type === ParseTreeTokenType.ARG_LIST) {
			if (requiresAnotherArgument(prev))
				return false;
			return true;
		}
		if (prev.type === ParseTreeTokenType.RETURN)
			return prev.lineIndex !== current.lineIndex;
		if (isComplete(prev, new Map()))
			return true;
		if (mightExpectNumber(prev))
			return false;
	}
	return true;
};