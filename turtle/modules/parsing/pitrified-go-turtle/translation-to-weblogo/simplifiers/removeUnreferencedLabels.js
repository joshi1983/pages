import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(referencedLabelNames) {
	return function(labelToken) {
		return !referencedLabelNames.has(labelToken.val);
	};
}

export function removeUnreferencedLabels(root) {
	const referencedLabelNames = new Set();
	for (const gotoToken of getDescendentsOfType(root, ParseTreeTokenType.GOTO)) {
		const nameToken = gotoToken.children[0];
		if (nameToken !== undefined && nameToken.type === ParseTreeTokenType.IDENTIFIER)
			referencedLabelNames.add(nameToken.val);
	}
	const unreferencedLabels = getDescendentsOfType(root, ParseTreeTokenType.LABEL).filter(isOfInterest(referencedLabelNames));
	unreferencedLabels.forEach(function(unreferencedLabel) {
		unreferencedLabel.remove();
	});
	return unreferencedLabels.length !== 0;
};