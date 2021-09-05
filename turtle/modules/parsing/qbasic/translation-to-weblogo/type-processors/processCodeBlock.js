import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from
'./helpers/processTokens.js';

const noBracketsParentTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB,
]);

function shouldGenerateBrackets(token) {
	const parent = token.parentNode;
	if (noBracketsParentTypes.has(parent.type))
		return false;
	else
		return true;
}

export function processCodeBlock(token, result) {
	const genBrackets = shouldGenerateBrackets(token);
	if (genBrackets)
		result.append('[ ');
	processTokens(token.children, result);
	if (genBrackets)
		result.append(' ]');
};