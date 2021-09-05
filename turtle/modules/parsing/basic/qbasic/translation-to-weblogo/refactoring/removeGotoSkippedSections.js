import { genericGetApplicableLabelFromGoto } from
'../../../helpers/genericGetApplicableLabelFromGoto.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isTokenStrictlyBetween } from
'../../../../generic-parsing-utilities/isTokenStrictlyBetween.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(getApplicableLabelFromGoto) {
	return function(token) {
		return getApplicableLabelFromGoto(token) !== undefined;
	};
}

function extraChecks(label, token, labels) {
	if (label === undefined ||
	label.lineIndex <= token.lineIndex)
		return;
	const labelParent = label.parentNode;
	if (labelParent !== token.parentNode)
		return;

	// Check if any labels between token and label are potentially used.
	// If some goto might jump into this involved section of code, return undefined.
	if (labels.some(label1 => isTokenStrictlyBetween(label1, token, label)))
		return;
	return label;
}


export function removeGotoSkippedSections(root) {
	const getApplicableLabelFromGoto = genericGetApplicableLabelFromGoto(root, extraChecks);
	const gotos = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest(getApplicableLabelFromGoto));
	gotos.forEach(function(gotoToken) {
		const label = getApplicableLabelFromGoto(gotoToken);
		for (let token = gotoToken; token !== label && token !== null;) {
			const next = token.getNextSibling();
			token.remove();
			token = next;
		}
	});
	return gotos.length !== 0;
};