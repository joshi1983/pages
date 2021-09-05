import { forToCodeBlock } from
'./forToCodeBlock.js';
import { forToInitToken } from
'./forToInitToken.js';
import { getVariableNameFromInitToken } from
'./getVariableNameFromInitToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function addReads(token, varName, result) {
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.val === varName) {
		const parent = token.parentNode;
		if (parent.type !== ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
		parent.type !== ParseTreeTokenType.DOT_PROPERTY) {
			result.add(token);
		}
	}
	if (token.type === ParseTreeTokenType.FOR) {
		const initToken = forToInitToken(token);
		if (initToken !== undefined) {
			const nestedVarName = getVariableNameFromInitToken(initToken);
			if (nestedVarName === varName)
				return; // no need to recurse into code within a for-loop that uses the same variable name.
		}
	}
	for (const child of token.children) {
		addReads(child, varName, result);
	}
}

export function getReadsForTranslation(forToken) {
	const initToken = forToInitToken(forToken);
	const varName = getVariableNameFromInitToken(initToken);
	const codeBlock = forToCodeBlock(forToken);
	const result = new Set();
	if (codeBlock !== undefined)
		addReads(codeBlock, varName, result);
	return result;
};