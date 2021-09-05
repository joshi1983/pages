import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { processTokens } from
'./helpers/processTokens.js';

export function processFunction(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length === 0)
		return;

	const firstChild = children[0];
	const argList = children[1];
	const procedureName = firstChild.val;
	result.append(`\nto ${procedureName} `);
	if (argList !== undefined)
		processTokens(filterBracketsAndCommas(argList.children), result);

	for (let i = 2; i < children.length; i++) {
		processToken(children[i], result);
	}
	const lastChild = children[children.length - 1];
	if (lastChild.type !== ParseTreeTokenType.END_FUNCTION &&
	lastChild.type !== ParseTreeTokenType.END_PROCEDURE)
		result.append(`\nend\n`);
};