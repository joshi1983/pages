import { getDescendentsOfType  } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { logicallyNegate } from './logicallyNegate.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType  } from
'../../ParseTreeTokenType.js';

function isOfInterest(labelsMap) {
	return function(gotoToken) {
		const nameToken = gotoToken.children[0];
		if (nameToken === undefined ||
		nameToken.type !== ParseTreeTokenType.IDENTIFIER)
			return false;

		const label = labelsMap.get(nameToken.val);
		if (label === undefined)
			return false;

		const parent = gotoToken.parentNode;
		if (parent.type !== ParseTreeTokenType.CODE_BLOCK)
			return false;

		const ifToken = parent.parentNode;
		if (ifToken.type !== ParseTreeTokenType.IF ||
		ifToken.children.length !== 2 ||
		ifToken.children.indexOf(parent) !== 1 ||
		ifToken.parentNode !== label.parentNode)
			return false;

		const labelParent = label.parentNode;
		const ifIndex = labelParent.children.indexOf(ifToken);
		const labelIndex = labelParent.children.indexOf(label);
		if (labelIndex > ifIndex)
			return false;

		return true;
	};
}

export function conditionalGotoToBreak(root) {
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL);
	const labelsMap = new Map();
	for (const label of labels) {
		labelsMap.set(label.val, label);
	}
	const gotoTokens = getDescendentsOfType(root, ParseTreeTokenType.GOTO);
	const gotosOfInterest = gotoTokens.filter(isOfInterest(labelsMap));
	gotosOfInterest.forEach(function(gotoToken) {
		// convert the goto statement into a break statement.
		const name = gotoToken.children[0].val;
		gotoToken.removeAllChildren();
		gotoToken.val = 'break';
		gotoToken.type = ParseTreeTokenType.BREAK;

		// logically negate the if-statement's condition.
		const ifToken = gotoToken.parentNode.parentNode;
		const conditionToken = ifToken.children[0];
		logicallyNegate(conditionToken);

		// Move everything from the label to the if-statement into an infinite-style for-loop.
		const label = labelsMap.get(name);
		const forToken = new ParseTreeToken('for', label.lineIndex, label.colIndex, ParseTreeTokenType.FOR);
		const codeBlock = new ParseTreeToken(null, label.lineIndex, label.colIndex, ParseTreeTokenType.CODE_BLOCK);
		codeBlock.appendChild(new ParseTreeToken('{', label.lineIndex, label.colIndex, ParseTreeTokenType.CURLY_LEFT_BRACKET));
		forToken.appendChild(codeBlock);

		const labelParent = label.parentNode;
		const labelParentChildren = labelParent.children;
		const labelIndex = labelParentChildren.indexOf(label);
		while (true) {
			const child = labelParent.children[labelIndex];
			
			if (child === ifToken) {
				labelParent.replaceChild(child, forToken)
			}
			else
				child.remove();
			codeBlock.appendChild(child);
			if (child === ifToken)
				break;
		}
	codeBlock.appendChild(new ParseTreeToken('}', label.lineIndex, label.colIndex, ParseTreeTokenType.CURLY_RIGHT_BRACKET));
		
	});
	return gotosOfInterest.length !== 0;
};