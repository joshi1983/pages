import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getLastDescendentTokenOf } from
'../../../generic-parsing-utilities/getLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function gotoCallToLabelName(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL ||
	token.children.length !== 2)
		return;
	const nameToken = token.children[0];
	if (nameToken.val === null ||
	nameToken.val.toLowerCase() !== 'goto')
		return;
	const args = token.children[1].children;
	if (args.length !== 1)
		return;
	const name = args[0].val;
	if (name === null)
		return;
	return name.toLowerCase();
}

function isGotoCall(token) {
	return gotoCallToLabelName(token) !== undefined;
}

function isGoto(label) {
	return function(token) {
		return gotoCallToLabelName(token) === label.val.toLowerCase();
	};
}

function isOfInterest(token) {
	const children = token.children;
	if (children < 2)
		return false;

	const label = token.getNextSibling();
	if (label === null ||
	label.type !== ParseTreeTokenType.LABEL)
		return false;

	const codeBlock = children[1];
	for (const child of codeBlock.children) {
		if (isGotoCall(child)) {
			if (isGoto(label)(child))
				return true;
			return false;
		}
	}
	return false;
}

export function whileGotoToIf(root) {
	const whiles = getDescendentsOfType(root, ParseTreeTokenType.WHILE).
		filter(isOfInterest);
	whiles.forEach(function(whileToken) {
		const children = whileToken.children;
		const condition = children[0];
		const wendToken = children[2];
		whileToken.type = ParseTreeTokenType.IF;
		whileToken.val = 'if';
		const conditionLast = getLastDescendentTokenOf(condition);
		const thenToken = new ParseTreeToken('then',
			conditionLast.lineIndex, conditionLast.colIndex + 1,
			ParseTreeTokenType.THEN);
		condition.appendSibling(thenToken);
		if (wendToken !== undefined) {
			wendToken.type = ParseTreeTokenType.END_IF;
			wendToken.val = null;
			const endToken = new ParseTreeToken('end',
				wendToken.lineIndex, wendToken.colIndex,
				ParseTreeTokenType.END);
			wendToken.appendChild(endToken);
			const ifToken = new ParseTreeToken('if',
				wendToken.lineIndex, wendToken.colIndex + 1,
				ParseTreeTokenType.IF);
			wendToken.appendChild(ifToken);
		}
	});
	return whiles.length !== 0;
};