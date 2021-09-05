import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const labelReferenceFunctionNames = new Set(['goto', 'gosub']);

function referencesALabel(call) {
	const children = call.children;
	if (children.length !== 2)
		return false;
	const nameToken = children[0];
	if (nameToken.val === null)
		return false;
	if (!labelReferenceFunctionNames.has(nameToken.val.toLowerCase()))
		return false;
	const args = children[1];
	if (args.children.length !== 1 || args.children[0].val === null)
		return false;
	return true;
}

function isOfInterest(root) {
	const referencedLabelNames = new Set();
	const calls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(referencesALabel);
	for (const call of calls) {
		referencedLabelNames.add(call.children[1].children[0].val.toLowerCase());
	}
	return function(token) {
		return !referencedLabelNames.has(token.val.toLowerCase());
	};
}

export function removeUnreferencedLabels(root) {
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL).
		filter(isOfInterest(root));
	labels.forEach(function(label) {
		label.remove();
	});
	return labels.length !== 0;
};