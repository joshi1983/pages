import { filterBracketsAndCommas } from
'../type-processors/helpers/filterBracketsAndCommas.js';
import { getClosestOfType } from
'../../../generic-parsing-utilities/getClosestOfType.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getFuncNamesThatDoNotBeginFills } from
'./helpers/getFuncNamesThatDoNotBeginFills.js';
import { getRemovableRootFor } from
'./helpers/getRemovableRootFor.js';
import { isBeginFillCall } from
'./helpers/isBeginFillCall.js';
import { isEndFillCall } from
'./helpers/isEndFillCall.js';
import { mightCallBeginFill } from
'./helpers/mightCallBeginFill.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(beginFillCalls, root) {
	const info = getFuncNamesThatDoNotBeginFills(root);
	const customFuncNames = info.customFuncNames;
	const funcNamesThatDoNotBeginFills = info.funcNamesThatDoNotBeginFills;

	return function(token) {
		const removableRoot = getRemovableRootFor(token);
		if (removableRoot === undefined)
			return false;

		const argList = token.children[0];
		if (argList.type === ParseTreeTokenType.ARGUMENT_LIST &&
		filterBracketsAndCommas(argList.children).length !== 0) {
			return false;
		}
		if (beginFillCalls.length === 0 &&
		getClosestOfType(removableRoot, ParseTreeTokenType.FUNCTION_DEFINITION) === null)
			return true;

		let tok = removableRoot.getPreviousSibling();
		while (tok !== null) {
			if (mightCallBeginFill(tok, customFuncNames, funcNamesThatDoNotBeginFills))
				return false;
			if (isEndFillCall(tok))
				return true;
			if (tok.type === ParseTreeTokenType.IDENTIFIER &&
			tok.children.length === 1) {
				const dot = tok.children[0];
				if (dot.type === ParseTreeTokenType.DOT &&
				dot.children.length === 1) {
					const child = dot.children[0];
					if (isEndFillCall(child))
						return true;
				}
			}
			const prev = tok.getPreviousSibling();
			tok = prev;
		}
		const parent = removableRoot.parentNode;
		if (parent.type === ParseTreeTokenType.TREE_ROOT)
			return true;
		return false;
	};
}

export function removeUnstartedEndFillCalls(root) {
	const funcCalls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL);
	const endShapeCalls = funcCalls.filter(isEndFillCall);
	if (endShapeCalls.length !== 0) {
		const beginFillCalls = funcCalls.filter(isBeginFillCall);
		const endFillCallsOfInterest = endShapeCalls.filter(isOfInterest(beginFillCalls, root));
		endFillCallsOfInterest.forEach(function(endFillCall) {
			endFillCall = getRemovableRootFor(endFillCall);
			endFillCall.remove();
		});
		return endFillCallsOfInterest.length !== 0;
	}
	return false;
};