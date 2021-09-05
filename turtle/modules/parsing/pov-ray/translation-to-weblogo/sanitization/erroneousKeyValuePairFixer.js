import { ExpectedChildrenResult, hasAllExpectedChildren } from '../../parsing/hasAllExpectedChildren.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(pair) {
	const parent = pair.parentNode;
	if (parent === null)
		return false;
	if (hasAllExpectedChildren(pair) === ExpectedChildrenResult.RIGIDLY_EQUAL)
		return false;
	return true;
}

export function erroneousKeyValuePairFixer(root) {
	const keyValuePairs = getDescendentsOfType(root, ParseTreeTokenType.KEY_VALUE_PAIR).
		filter(isOfInterest);
	keyValuePairs.forEach(function(pair) {
		const children = pair.children;
		const parent = pair.parentNode;
		let index = parent.children.indexOf(pair);
		pair.remove();
		for (const newChild of children) {
			newChild.remove();
			parent.insertChildBefore(index, newChild);
			index++;
		}
	});
};