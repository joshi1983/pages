import { getClosestOfType } from
'../../../generic-parsing-utilities/getClosestOfType.js';
import { getDescendentsOfType  } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType  } from
'../../ParseTreeTokenType.js';

function isOfInterest(labels) {
	const labelsMap = new Map();
	for (const label of labels) {
		labelsMap.set(label.val, label);
	}
	return function(gotoToken) {
		const nameToken = gotoToken.children[0];
		if (nameToken === undefined ||
		nameToken.type !== ParseTreeTokenType.IDENTIFIER)
			return false;

		const label = labelsMap.get(nameToken.val);
		if (label === undefined)
			return false;
		
		const nearestFor = getClosestOfType(gotoToken, ParseTreeTokenType.FOR);
		if (nearestFor === null)
			return false;
		const next = nearestFor.getNextSibling();
		if (next !== label)
			return false;

		return true;
	};
}

export function gotoToBreak(root) {
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL);
	const gotoTokens = getDescendentsOfType(root, ParseTreeTokenType.GOTO);
	const gotosOfInterest = gotoTokens.filter(isOfInterest(labels));
	gotosOfInterest.forEach(function(gotoToken) {
		gotoToken.removeAllChildren();
		gotoToken.val = 'break';
		gotoToken.type = ParseTreeTokenType.BREAK;
	});
	return gotosOfInterest.length !== 0;
};