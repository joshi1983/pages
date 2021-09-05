import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(labelsMap) {
	return function(gotoToken) {
		const firstChild = gotoToken.children[0];
		if (firstChild === undefined || firstChild.type !== ParseTreeTokenType.IDENTIFIER)
			return false;
		const correspondingLabel = labelsMap.get(firstChild.val);
		if (correspondingLabel === undefined)
			return false;
		const labelParent = correspondingLabel.parentNode;
		const gotoParent = gotoToken.parentNode;
		if (labelParent !== gotoParent)
			return false;

		// look for any labels between gotoToken and correspondingLabel.
		const children = gotoParent.children;
		const gotoIndex = children.indexOf(gotoToken);
		const labelIndex = children.indexOf(correspondingLabel);
		if (labelIndex < gotoIndex)
			return false;
		for (let i = gotoIndex + 1; i < labelIndex; i++) {
			const child = children[i];
			const labels = getDescendentsOfType(child, ParseTreeTokenType.LABEL);
			if (labels.length !== 0 || child.type === ParseTreeTokenType.LABEL)
				return false;
		}
		return true;
	};
}

export function removeGotoSkippedSections(root) {
	const gotos = getDescendentsOfType(root, ParseTreeTokenType.GOTO);
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL);
	const labelsMap = new Map();
	for (const label of labels) {
		labelsMap.set(label.val, label);
	}
	const gotosOfInterest = gotos.filter(isOfInterest(labelsMap));
	gotosOfInterest.forEach(function(gotoToken) {
		const name = gotoToken.children[0].val;
		const label = labelsMap.get(name);
		while (true) {
			let next = gotoToken.getNextSibling();
			if (next === null || next === label)
				break;

			next.remove();
		}
		gotoToken.remove();
	});
	return gotosOfInterest.length !== 0;
};