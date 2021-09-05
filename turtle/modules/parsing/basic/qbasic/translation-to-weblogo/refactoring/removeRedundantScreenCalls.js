import { evaluateToken } from
'../../evaluation/evaluateToken.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isGotoCallToken } from
'../../parsing/parse-tree-analysis/isGotoCallToken.js';
import { isInCustomFunction } from
'../../parsing/parse-tree-analysis/isInCustomFunction.js';
import { mightBeDataValue } from
'../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from
'../../QBasicInternalFunctions.js';

function isScreenCall(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const children = token.children;
	if (children.length === 2) {
		const nameToken = children[0];
		if (nameToken.children.length !== 0)
			return false;
		return nameToken.val.toLowerCase() === 'screen';
	}
	return false;
}

function screenCallToVal(screenCall) {
	const args = screenCall.children[1].children.filter(mightBeDataValue);
	const arg = args[0];
	if (arg === undefined)
		return;

	return evaluateToken(arg);
}

function mightSetScreenModeOtherThan(token, screenMode, aCustomFunctionSetsScreenMode) {
	if (isScreenCall(token)) {
		return screenCallToVal(token) !== screenMode;
	}
	if (isGotoCallToken(token))
		return true; // might goto/jump to a place that modifies screen mode.
	if (aCustomFunctionSetsScreenMode) {
		if (token.type === ParseTreeTokenType.CALL)
			return true;
		if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
			const nameToken = token.children[0];
			if (nameToken.type === ParseTreeTokenType.IDENTIFIER) {
				const info = QBasicInternalFunctions.getFunctionInfo(nameToken.val);
				if (info === undefined)
					return true;
			}
		}
	}
	for (const child of token.children) {
		if (mightSetScreenModeOtherThan(child, screenMode, aCustomFunctionSetsScreenMode))
			return true;
	}
	return false;
}

function isOfInterest(screenCalls) {
	const zeroScreenCalls = screenCalls.filter(function(screenCall) {
		return screenCallToVal(screenCall) === 0;
	});
	const allCallsAreZero = zeroScreenCalls.length === screenCalls.length;
	const aCustomFunctionSetsScreenMode = screenCalls.some(function(screenCall) {
		return isInCustomFunction(screenCall);
	});
	return function(token) {
		if (allCallsAreZero)
			return true;

		const val = screenCallToVal(token);
		if (val === undefined)
			return false;

		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.TREE_ROOT ||
		parent.type === ParseTreeTokenType.CODE_BLOCK) {
			let tok = token.getPreviousSibling();
			while (tok !== null) {
				if (isScreenCall(tok)) {
					return screenCallToVal(tok) === val;
				}
				else if (mightSetScreenModeOtherThan(tok, val, aCustomFunctionSetsScreenMode))
					return false; // because we don't really know.

				tok = tok.getPreviousSibling();
			}
			if (isInCustomFunction(token))
				return false;
			else
				return val === 0;
		}
		return false;
	};
}

export function removeRedundantScreenCalls(root) {
	const allScreenCalls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).filter(isScreenCall);
	if (allScreenCalls.length !== 0) {
		const screenCalls = allScreenCalls.filter(isOfInterest(allScreenCalls));
		screenCalls.forEach(function(screenCall) {
			screenCall.remove();
		});
		return screenCalls.length !== 0;
	}
	return false;
};