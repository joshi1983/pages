import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { processTokens } from
'./helpers/processTokens.js';

function funcToArgList(funcToken) {
	for (const child of funcToken.children) {
		if (child.type === ParseTreeTokenType.ARG_LIST)
			return child;
	}
}

function funcToCodeBlock(funcToken) {
	const children = funcToken.children;
	const lastChild = children[children.length - 1];
	if (lastChild.type !== ParseTreeTokenType.CODE_BLOCK)
		return;
	return lastChild;
}

function getNameToken(children) {
	for (let i = 0; i < 2; i++) {
		const child = children[i];
		if (child === undefined)
			break;
		else if (child.type === ParseTreeTokenType.IDENTIFIER)
			return child;
	}
}

export function processFunc(token, result, settings) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length !== 0) {
		const nameToken = getNameToken(children);
		if (nameToken === undefined)
			return; // can't translate anything to valid WebLogo procedure so stop immediately.

		result.append('\nto ');
		if (nameToken.type === ParseTreeTokenType.IDENTIFIER)
			result.append(nameToken.val);
		else
			processToken(nameToken, result, settings);
		result.append(' ');
		if (children.length > 1) {
			const argList = funcToArgList(token);
			const codeBlock = funcToCodeBlock(token);
			if (argList !== undefined)
				processTokens(filterBracketsAndCommas(argList.children), result, settings);
			if (codeBlock !== undefined) {
				result.append('\n');
				processTokens(codeBlock.children, result, settings);
			}
		}
		result.append('\nend\n');
	}
};