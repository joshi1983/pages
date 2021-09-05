import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from
'../../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function ifToThen(ifToken) {
	for (const child of ifToken.children) {
		if (child.type === ParseTreeTokenType.THEN)
			return child;
	}
}

function ifToCodeBlock(ifToken) {
	for (const child of ifToken.children) {
		if (child.type === ParseTreeTokenType.CODE_BLOCK)
			return child;
	}
}

function mightBeLabel(token) {
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL) {
		if (token.val[0] === '-' || token.val.indexOf('.') !== -1)
			return false;
		
		return true;
	}
	else if (token.type === ParseTreeTokenType.LABEL)
		return true;

	return false;
}

function isOfInterest(ifToken) {
	const codeBlock = ifToCodeBlock(ifToken);
	if (codeBlock === undefined)
		return false;

	const firstChild = codeBlock.children[0];
	if (firstChild === undefined ||
	!mightBeLabel(firstChild))
		return false;

	const thenToken = ifToThen(ifToken);
	if (thenToken !== undefined) {
		if (firstChild.lineIndex !== thenToken.lineIndex)
			return false;
	}
	else if (ifToken.lineIndex !== firstChild.lineIndex)
		return false;

	return true;
}

export function implicitToExplicitGoto(root) {
	const ifs = getDescendentsOfType(root, ParseTreeTokenType.IF).
		filter(isOfInterest);
	ifs.forEach(function(ifToken) {
		const codeBlock = ifToCodeBlock(ifToken);
		const labelToken = codeBlock.children[0];
		const functionCall = new ParseTreeToken(null, labelToken.lineIndex,
			labelToken.colIndex - 1,
			ParseTreeTokenType.FUNCTION_CALL);
		const gotoToken = new ParseTreeToken('goto', labelToken.lineIndex,
			functionCall.colIndex,
			ParseTreeTokenType.IDENTIFIER);
		const argList = new ParseTreeToken(null, labelToken.lineIndex, labelToken.colIndex,
			ParseTreeTokenType.ARG_LIST);
		functionCall.appendChild(gotoToken);
		functionCall.appendChild(argList);
		codeBlock.replaceChild(labelToken, functionCall);
		labelToken.remove();
		argList.appendChild(labelToken);
	});
};