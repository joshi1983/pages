import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../qbasic/ParseTreeTokenType.js';

export function genericGetApplicableLabelFromGoto(root, extraChecks) {
	if (extraChecks === undefined)
		extraChecks = (label) => label;
	else if (typeof extraChecks !== 'function')
		throw new Error(`extraChecks must be a function or undefined but found ${extraChecks}`);

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
	
		return extraChecks(label, token, labels);
	};
}