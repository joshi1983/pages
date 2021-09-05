import { filterBracketsAndCommas, isBracketOrComma } from
'../type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER ||
	firstChild.val !== 'rangeTo')
		return false;
	const argList = children[1];
	if (argList.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const argValueTokens = filterBracketsAndCommas(argList.children);
	if (argValueTokens.length !== 2)
		return false;
	return true;
}

export function replaceRangeToWithToOperator(root) {
	const rangeToCalls = getDescendentsOfType(root, ParseTreeTokenType.FUNC_CALL).filter(isOfInterest);
	rangeToCalls.forEach(function(rangeToCall) {
		const children = rangeToCall.children;
		const firstChild = children[0];
		const argList = children[1];
		rangeToCall.type = ParseTreeTokenType.BINARY_OPERATOR;
		rangeToCall.val = 'to';
		firstChild.remove(); // remove the 'rangeTo' identifier.
		// remove any brackets and commas from argList.
		for (const child of argList.children) {
			if (isBracketOrComma(child))
				child.remove();
		}
		argList.removeSingleToken();
	});
	return rangeToCalls.length !== 0;
};