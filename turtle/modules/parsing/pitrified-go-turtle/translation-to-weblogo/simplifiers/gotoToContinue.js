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
		let children = nearestFor.children;
		const codeBlock = children[children.length - 1];
		if (codeBlock === undefined || codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
			return false;

		children = codeBlock.children;
		for (let i = children.length - 1; i > 0; i--) {
			const child = children[i];
			if (child === label)
				return true;

			if (child.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET &&
			child.type !== ParseTreeTokenType.LABEL)
				return false;
		}
		return false;
	};
}

export function gotoToContinue(root) {
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL);
	const gotoTokens = getDescendentsOfType(root, ParseTreeTokenType.GOTO);
	const gotosOfInterest = gotoTokens.filter(isOfInterest(labels));
	gotosOfInterest.forEach(function(gotoToken) {
		gotoToken.removeAllChildren();
		gotoToken.val = 'continue';
		gotoToken.type = ParseTreeTokenType.CONTINUE;
	});
	return gotosOfInterest.length !== 0;
};