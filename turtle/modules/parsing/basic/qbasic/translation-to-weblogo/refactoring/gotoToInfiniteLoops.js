import { genericGetApplicableLabelFromGoto } from
'../../../helpers/genericGetApplicableLabelFromGoto.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(getApplicableLabelFromGoto) {
	return function(token) {
		const label = getApplicableLabelFromGoto(token);
		return label !== undefined;
	};
}

function extraChecks(label, token, labels) {
	if (label === undefined ||
	label.lineIndex > token.lineIndex)
		return;
	const labelParent = label.parentNode;
	if (labelParent !== token.parentNode)
		return;
	return label;
}

export function gotoToInfiniteLoops(root) {
	const getApplicableLabelFromGoto = genericGetApplicableLabelFromGoto(root, extraChecks);
	const gotos = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest(getApplicableLabelFromGoto));
	gotos.forEach(function(gotoToken) {
		const label = getApplicableLabelFromGoto(gotoToken);
		if (label === undefined)
			return; // nothing to do.  
			// This can happen if a previous fix's changes to the tree make this unable to find the label.
		const whileToken = new ParseTreeToken('WHILE', label.lineIndex, label.colIndex + 1, ParseTreeTokenType.WHILE);
		const conditionToken = new ParseTreeToken('1', label.lineIndex, label.colIndex + 1, ParseTreeTokenType.NUMBER_LITERAL);
		const codeBlock = new ParseTreeToken(null, label.lineIndex, label.colIndex + 1, ParseTreeTokenType.CODE_BLOCK);
		const wendToken = gotoToken;
		
		// Add all the instructions between the label and the goto statement into the new code block.
		let nextSibling;
		for (let tok = label.getNextSibling();
		tok !== wendToken && tok !== null;
		tok = nextSibling) {
			nextSibling = tok.getNextSibling();
			tok.remove();
			codeBlock.appendChild(tok);
		}
		wendToken.val = 'WEND';
		wendToken.type = ParseTreeTokenType.WEND;
		wendToken.removeAllChildren();
		whileToken.appendChild(conditionToken);
		whileToken.appendChild(codeBlock);
		wendToken.remove();
		whileToken.appendChild(wendToken);
		label.appendSibling(whileToken);
	});
	return gotos.length !== 0;
};