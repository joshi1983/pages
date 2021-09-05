import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from
'./helpers/processTokens.js';

function getNameToken(token) {
	let firstChild = token.children[0];
	if (firstChild === undefined)
		return;
	if (firstChild.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		firstChild = firstChild.children[0];
	if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild;
}

function getArgListToken(token) {
	const secondChild = token.children[1];
	if (secondChild !== undefined && secondChild.type === ParseTreeTokenType.ARG_LIST)
		return secondChild;
}

function getCodeBlock(token) {
	const firstChild = token.children[0];
	if (firstChild.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		const secondChild = firstChild.children[1];
		if (secondChild === undefined ||
		secondChild.type !== ParseTreeTokenType.CODE_BLOCK)
			return;
		return secondChild;
	}
	const children = token.children;
	const codeBlock = children[children.length - 1];
	if (codeBlock !== undefined && codeBlock.type === ParseTreeTokenType.CODE_BLOCK)
		return codeBlock;
}

function shouldPrefixWithOutput(codeBlockChildren) {
	if (codeBlockChildren.length !== 1)
		return false;
	const firstChild = codeBlockChildren[0];
	if (firstChild.type === ParseTreeTokenType.FUNC_CALL) {
		const funcInfo = MigrationInfo.getFunctionInfo(firstChild);
		if (funcInfo !== undefined && funcInfo.returnTypes === null)
			return false; // for example println doesn't return anything and 
			// WebLogo's print won't either so 'output ' before that would only create problems.
	}
	const codeBlock = firstChild.parentNode;
	const prev = codeBlock.getPreviousSibling();
	if (prev === undefined ||
	prev.type === ParseTreeTokenType.ARG_LIST)
		return false; // no return type specified so the function is unlikely supposed to return anything.

	return true;
}

export function processDef(token, result, settings) {
	result.processCommentsUpToToken(token);
	const nameToken = getNameToken(token);
	if (nameToken !== undefined) {
		result.append('\nto ' + nameToken.val);
		const argList = getArgListToken(token);
		if (argList !== undefined) {
			for (const arg of filterBracketsAndCommas(argList.children)) {
				if (arg.type === ParseTreeTokenType.IDENTIFIER) {
					result.append(' :' + arg.val);
				}
			}
		}
		result.append('\n');
		const codeBlock = getCodeBlock(token);
		if (codeBlock !== undefined) {
			const codeBlockChildren = filterBracketsAndCommas(codeBlock.children);
			if (shouldPrefixWithOutput(codeBlockChildren))
				result.append('\toutput ');
			processTokens(codeBlockChildren, result, settings);
		}

		result.append('\nend\n');
	}
};