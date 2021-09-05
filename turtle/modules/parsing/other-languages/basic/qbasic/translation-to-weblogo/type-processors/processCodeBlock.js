import { isGotoCallToken } from
'../../parsing/parse-tree-analysis/isGotoCallToken.js';
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
		if (isGotoCallToken(child)) {
			const argList = child.children[1];
			if (argList.children.length === 1) {
				const childChild = argList.children[0];
				if (childChild.val.toLowerCase() === labelVal)
					return i;
			}
		}
	}
	return -1;
}

function getIndexOfLabel(children, startIndex, labelVal) {
	for (let i = startIndex; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.LABEL &&
		child.val.toLowerCase() === labelVal) {
			return i;
		}
	}
	return -1;
}

function getNearestIndexAfter(startIndex, indexes) {
	if (indexes.size === 0)
		return;
	indexes = Array.from(indexes).filter(i => i >= startIndex);
	if (indexes.length === 0)
		return;
	return Math.min(...indexes);
}

export function processCodeBlock(token, result, options) {
	result.processCommentsUpToToken(token);
	const genBrackets = shouldGenerateBrackets(token);
	if (genBrackets)
		result.append('[ ');
	result.processCommentsUpToToken(token);
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
		else if (isGotoCallToken(child)) {
			const labelToken = child.children[1].children[0];
			if (labelToken !== undefined &&
			labelToken.type === ParseTreeTokenType.IDENTIFIER) {
				const labelIndex = getIndexOfLabel(children, i + 1, labelToken.val.toLowerCase());
				if (labelIndex > 0) {
					const nearestForeverEndBracket = getNearestIndexAfter(i + 1, stopIndexes);
					if (nearestForeverEndBracket !== undefined && nearestForeverEndBracket < labelIndex) {
						result.append(' break\n');
					}
					continue;
				}
			}
		}
		if (stopIndexes.has(i))
			result.append(' ]\n');
		else
			processToken(child, result, options);
	}
	if (genBrackets)
		result.append(' ]');
};