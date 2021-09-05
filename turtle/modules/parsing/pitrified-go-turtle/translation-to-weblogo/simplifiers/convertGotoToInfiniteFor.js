import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(labelsMap) {
	return function(gotoToken) {
		const gotoChild = gotoToken.children[0];
		if (gotoChild === undefined || gotoChild.type !== ParseTreeTokenType.IDENTIFIER)
			return false;

		const labelToken = labelsMap.get(gotoChild.val);
		if (labelToken === undefined)
			return false;

		const parent = gotoToken.parentNode;
		if (labelToken.parentNode !== parent)
			return false;

		const children = parent.children;
		const labelIndex = children.indexOf(labelToken);
		const gotoIndex = children.indexOf(gotoToken);
		if (gotoIndex < labelIndex)
			return false;

		return true;
	};
}

export function convertGotoToInfiniteFor(root) {
	const gotosMap = new Map();
	const gotos = getDescendentsOfType(root, ParseTreeTokenType.GOTO);
	const labelsMap = new Map();
	for (const label of getDescendentsOfType(root, ParseTreeTokenType.LABEL)) {
		labelsMap.set(label.val, label);
	}
	const gotosOfInterest = gotos.filter(isOfInterest(labelsMap));
	gotosOfInterest.forEach(function(gotoToken) {
		const name = gotoToken.children[0].val;
		const labelToken = labelsMap.get(name);
		const forToken = new ParseTreeToken('for', labelToken.lineIndex, labelToken.colIndex, ParseTreeTokenType.FOR);
		const codeBlock = new ParseTreeToken(null, labelToken.lineIndex, labelToken.colIndex, ParseTreeTokenType.CODE_BLOCK);
		forToken.appendChild(codeBlock);
		codeBlock.appendChild(new ParseTreeToken('{', labelToken.lineIndex, labelToken.colIndex, ParseTreeTokenType.CURLY_LEFT_BRACKET));
		while (true) {
			const next = labelToken.getNextSibling();
			if (next === null || next === gotoToken)
				break;

			next.remove();
			codeBlock.appendChild(next);
		}
		codeBlock.appendChild(new ParseTreeToken('}', labelToken.lineIndex, labelToken.colIndex, ParseTreeTokenType.CURLY_RIGHT_BRACKET));
		labelToken.appendSibling(forToken);
		gotoToken.remove();
	});
	return gotosOfInterest.length !== 0;
};