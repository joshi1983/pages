import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isIdentifier } from
'../../scanning/isIdentifier.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(gosubToken) {
	if (gosubToken.children.length !== 1)
		return false;

	const argList = gosubToken.children[0];
	if (argList.children.length !== 1)
		return false;

	const parent = gosubToken.parentNode;
	if (parent.type !== ParseTreeTokenType.TREE_ROOT)
		return false;

	let tok = gosubToken.getNextSibling();
	while (tok !== null && tok.type !== ParseTreeTokenType.RETURN) {
		if (tok.type === ParseTreeTokenType.SUB ||
		tok.type === ParseTreeTokenType.FUNCTION)
			return false; // would be too weird to have that in a subroutine.
			// If such a token is found, we're not interested.  
			// Something unrelated needs to be fixed first.

		tok = tok.getNextSibling();
	}
	if (tok === null ||
	tok.children.length !== 0)
		return false;
	
	return true;
}

function convertLabelToSub(labelToken) {
	if (labelToken.type !== ParseTreeTokenType.LABEL)
		return; // maybe this label was already converted to a subroutine.

	const tokensToMove = [];
	let tok = labelToken.getNextSibling();
	while (tok !== null) {
		if (tok.type === ParseTreeTokenType.RETURN)
			break;

		tokensToMove.push(tok);
		tok = tok.getNextSibling();
	}
	if (tok === null)
		return; // give up.  This would be a little weird but
		// another convertLabelToSub call might make converting the label to a sub not possible.

	const subToken = new ParseTreeToken('sub', labelToken.lineIndex, labelToken.colIndex - 1,
		ParseTreeTokenType.SUB);
	if (!isIdentifier(labelToken.val))
		labelToken.val = 'sub' + labelToken.val;
	labelToken.type = ParseTreeTokenType.IDENTIFIER;
	labelToken.parentNode.replaceChild(labelToken, subToken);
	subToken.appendChild(labelToken);
	const argList = new ParseTreeToken(null, labelToken.lineIndex, labelToken.colIndex + 1,
		ParseTreeTokenType.ARG_LIST);
	const openBracket = new ParseTreeToken('(', argList.lineIndex, argList.colIndex,
		ParseTreeTokenType.CURVED_LEFT_BRACKET);
	const closeBracket = new ParseTreeToken(')', argList.lineIndex, argList.colIndex,
		ParseTreeTokenType.CURVED_RIGHT_BRACKET);
	argList.appendChild(openBracket);
	argList.appendChild(closeBracket);
	subToken.appendChild(argList);
	let codeBlockPositionToken = argList;
	if (tokensToMove.length === 0)
		codeBlockPositionToken = tok;
	else {
		codeBlockPositionToken = tokensToMove[0];
	}
	const codeBlock = new ParseTreeToken(null, codeBlockPositionToken.lineIndex, codeBlockPositionToken.colIndex,
		ParseTreeTokenType.CODE_BLOCK);
	subToken.appendChild(codeBlock);
	for (const tokenToMove of tokensToMove) {
		tokenToMove.remove();
		codeBlock.appendChild(tokenToMove);
	}
	const endSub = new ParseTreeToken(null, tok.lineIndex, tok.colIndex,
		ParseTreeTokenType.END_SUB);
	subToken.appendChild(endSub);
	tok.remove();
	tok.val = 'end';
	tok.type = ParseTreeTokenType.END;
	endSub.appendChild(tok);
	const subToken2 = new ParseTreeToken('sub', tok.lineIndex, tok.colIndex + 1,
		ParseTreeTokenType.SUB);
	endSub.appendChild(subToken2);
}

/*
Checks if this is too early to convert the specified label to a subroutine.

Fixers like mergeNeighbouringLabels and removeUnreferencedLabels 
should run first if there is a neighbouring label.
*/
function hasNeighbouringLabel(label) {
	const prev = label.getPreviousSibling();
	if (prev !== null && prev.type === ParseTreeTokenType.LABEL)
		return true;

	const next = label.getNextSibling();
	if (next !== null && next.type === ParseTreeTokenType.LABEL)
		return true;

	return false;
}

export function goSubToSubroutines(root) {
	let gosubs = getDescendentsOfType(root, ParseTreeTokenType.GOSUB).
		filter(isOfInterest);
	if (gosubs.length !== 0) {
		const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL);
		const labelNames = new Map();
		const problematicNames = new Set();
		for (const label of labels) {
			const name = label.val.toLowerCase();
			if (!problematicNames.has(name)) {
				if (labelNames.has(name)) {
					// ambiguous labels should be rare but we don't want to fix such ambiguity here.
					labelNames.delete(name);
					problematicNames.add(name);
				}
				else
					labelNames.set(name, label);
			}
		}
		gosubs = gosubs.filter(function(s) {
			const labelToken = s.children[0].children[0];
			const labelName = ('' + labelToken.val).toLowerCase();
			return labelNames.has(labelName);
		});
		gosubs.forEach(function(gosubToken) {
			const argList = gosubToken.children[0];
			const child = argList.children[0];
			const labelName = child.val.toLowerCase();
			const labelToken = labelNames.get(labelName);
			if (labelToken !== undefined) {
				if (hasNeighbouringLabel(labelToken))
					return;

				convertLabelToSub(labelToken);
				if (labelToken.val.toLowerCase() !== labelName) {
					child.val = labelToken.val;
				}
				child.type = ParseTreeTokenType.IDENTIFIER;
				child.remove();
				gosubToken.insertAsFirstChild(child);
				gosubToken.type = ParseTreeTokenType.FUNCTION_CALL;
				gosubToken.val = null;
				argList.appendChild(new ParseTreeToken('(', argList.lineIndex, argList.colIndex,
					ParseTreeTokenType.CURVED_LEFT_BRACKET));
				argList.appendChild(new ParseTreeToken(')', argList.lineIndex, argList.colIndex + 1,
					ParseTreeTokenType.CURVED_RIGHT_BRACKET));
				child.lineIndex = gosubToken.lineIndex;
				child.colIndex = gosubToken.colIndex;
			}
		});
	}
};