import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';

const noBracketsParentTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB,
]);

function shouldGenerateBrackets(token) {
	if (token.type === ParseTreeTokenType.TREE_ROOT)
		return false;
	const parent = token.parentNode;
	if (noBracketsParentTypes.has(parent.type))
		return false;
	else
		return true;
}

function getIndexOfGoto(children, startIndex, labelVal) {
	for (let i = startIndex; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.FUNCTION_CALL) {
			const childChildren = child.children;
			const firstChild = childChildren[0];
			if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.IDENTIFIER &&
			firstChild.val.toLowerCase() === 'goto' &&
			childChildren.length === 2) {
				const argList = childChildren[1];
				if (argList.children.length === 1) {
					const childChild = argList.children[0];
					if (childChild.val.toLowerCase() === labelVal)
						return i;
				}
			}
		}
	}
	return -1;
}

export function processCodeBlock(token, result) {
	const genBrackets = shouldGenerateBrackets(token);
	if (genBrackets)
		result.append('[ ');
	const children = token.children;
	const stopIndexes = new Set();
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.LABEL) {
			const labelVal = child.val.toLowerCase();
			const gotoIndex = getIndexOfGoto(children, i + 1, child.val.toLowerCase());
			if (gotoIndex > 0) {
				result.append(' forever [\n');
				stopIndexes.add(gotoIndex);
			}
		}
		if (stopIndexes.has(i))
			result.append(' ]\n');
		else
			processToken(child, result);
	}
	if (genBrackets)
		result.append(' ]');
};