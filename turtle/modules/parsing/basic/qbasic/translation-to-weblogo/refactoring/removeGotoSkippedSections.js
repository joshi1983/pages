import { genericGetApplicableLabelFromGoto } from
'../../../helpers/genericGetApplicableLabelFromGoto.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(getApplicableLabelFromGoto) {
	return function(token) {
		return getApplicableLabelFromGoto(token) !== undefined;
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