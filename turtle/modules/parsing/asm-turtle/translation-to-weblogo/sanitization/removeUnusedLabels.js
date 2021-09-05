import { getDescendentsOfTypes } from
'../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isProcedureStartLabel(label) {
	return label.parentNode.type === ParseTreeTokenType.PROC_START;
}

export function removeUnusedLabels(root) {
	const allLabels = getDescendentsOfTypes(root, [ParseTreeTokenType.LABEL, ParseTreeTokenType.LABEL_ANCHOR]);
	const labelAnchors = allLabels.filter(label => label.type === ParseTreeTokenType.LABEL_ANCHOR);
	const labelAnchorsSet = new Set(labelAnchors);
	const nonAnchors = allLabels.filter(label => label.type === ParseTreeTokenType.LABEL);
	const nonAnchorNames = new Set(nonAnchors.map(label => '@' + label.val.toLowerCase()));
	for (const label of labelAnchorsSet) {
		if (!nonAnchorNames.has(label.val.toLowerCase()) && !isProcedureStartLabel(label)) {
			label.remove();
		}
	}
};