import { canBeIntegerLabel } from '../../scanning/canBeIntegerLabel.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const labelReferenceFunctionNames = new Set(['goto', 'gosub']);
const labelRefTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL
]);

function refTokenToLabelRefValueToken(refToken) {
	if (refToken.type === ParseTreeTokenType.FUNCTION_CALL)
		return refToken.children[1].children[0]; // for goto calls
	else if (refToken.type === ParseTreeTokenType.GOSUB)
		return refToken.children[0].children[0];
}

function isReferencingALabel(token) {
	const children = token.children;
	if (token.type === ParseTreeTokenType.GOSUB) {
		if (children.length !== 1)
			return false;
		const argList = children[0];
		const argListChildren = argList.children;
		if (argListChildren.length !== 1)
			return false;
		const child = argListChildren[0];
		if (child.children.length !== 0 ||
		!labelRefTypes.has(child.type) ||
		typeof child.val !== 'string')
			return false;
		return true;
	}
	if (children.length !== 2)
		return false;
	const nameToken = children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	!labelReferenceFunctionNames.has(nameToken.val.toLowerCase()))
		return false;
	const argList = children[1];
	const labelValToken = argList.children[0];
	if (labelValToken === undefined ||
	typeof labelValToken.val !== 'string' ||
	!labelRefTypes.has(labelValToken.type) ||
	labelValToken.children.length !== 0)
		return false;
	return true;
}

function isOfInterest(token) {
	const next = token.getNextSibling();
	if (next === null || next.type !== ParseTreeTokenType.LABEL)
		return false;
	return true;
}

export function mergeNeighbouringLabels(root) {
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL).
		filter(isOfInterest);
	if (labels.length !== 0) {
		const labelNameToReferencesMap = new Map();
		const references = getDescendentsOfTypes(root, [ParseTreeTokenType.FUNCTION_CALL, ParseTreeTokenType.GOSUB]).
			filter(isReferencingALabel);
		for (const ref of references) {
			const labelName = refTokenToLabelRefValueToken(ref).val.toLowerCase();
			let refs = labelNameToReferencesMap.get(labelName);
			if (refs === undefined) {
				refs = [];
				labelNameToReferencesMap.set(labelName, refs);
			}
			refs.push(ref);
		}
		labels.forEach(function(label) {
			const next = label.getNextSibling();
			if (next === null || next.type !== ParseTreeTokenType.LABEL)
				return; // nothing to do.
				// a previous mutation may have made a label of interest to become not of interest.
			const refs = labelNameToReferencesMap.get(label.val.toLowerCase());
			let newType = ParseTreeTokenType.NUMBER_LITERAL;
			if (!canBeIntegerLabel(next.val))
				newType = ParseTreeTokenType.IDENTIFIER;
			if (refs !== undefined) {
				let nextRefs = labelNameToReferencesMap.get(next.val.toLowerCase());
				if (nextRefs === undefined) {
					nextRefs = [];
					labelNameToReferencesMap.set(next.val.toLowerCase(), nextRefs);
				}
				
				for (const ref of refs) {
					const labelRefToken = refTokenToLabelRefValueToken(ref);
					labelRefToken.val = next.val;
					labelRefToken.type = newType;
					nextRefs.push(ref);
				}
				refs.length = 0; // all references to label have been removed.
				// Update the Map to reflect that change.
			}
			label.remove();
		});
	}
	return labels.length !== 0;
};