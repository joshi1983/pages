import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isTokenStrictlyBetween } from
'../../../generic-parsing-utilities/isTokenStrictlyBetween.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(getApplicableLabelFromGoto) {
	return function(token) {
		return getApplicableLabelFromGoto(token) !== undefined;
	};
}

function genericGetApplicableLabelFromGoto(root) {
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL);
	const labelMap = new Map();
	for (const label of labels) {
		labelMap.set(label.val.toLowerCase(), label);
	}
	return function(token) {
		const children = token.children;
		if (children.length !== 2)
			return;
		const nameToken = children[0];
		if (nameToken.val === null ||
		nameToken.val.toLowerCase() !== 'goto')
			return;
		const argsToken = children[1];
		if (argsToken.val !== null ||
		argsToken.children.length !== 1)
			return;
		const labelName = argsToken.children[0].val;
		if (labelName === null)
			return;
		const label = labelMap.get(labelName.toLowerCase());
		if (label === undefined)
			return;
		if (label.lineIndex <= token.lineIndex)
			return;
		const labelParent = label.parentNode;
		if (labelParent !== token.parentNode)
			return;

		// Check if any labels between token and label are potentially used.
		// If some goto might jump into this involved section of code, return undefined.
		if (labels.some(label1 => isTokenStrictlyBetween(label1, token, label)))
			return;
	
		return label;
	};
}

export function removeGotoSkippedSections(root) {
	const getApplicableLabelFromGoto = genericGetApplicableLabelFromGoto(root);
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