import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

// The following are very different:
// from math import * 
// import math
function isUsingFrom(token) {
	const prev = token.getPreviousSibling();
	if (prev !== null && prev.val === 'from')
		return true;
	return false;
}

export function isLikelyOnPackage(token, cachedParseTree, packageName) {
	const packageToken = cachedParseTree.getAllImportedPackages().get(packageName);
	if (packageToken === undefined)
		return false;

	const parent = token.parentNode;
	if (isUsingFrom(packageToken)) {
		if (parent.type === ParseTreeTokenType.DOT)
			return false;
	}
	else {

		// assuming the import math format, the reference should be something like math.sin.
		const dot = token.parentNode;
		if (dot.type !== ParseTreeTokenType.DOT)
			return false;
		const grandParent = dot.parentNode;
		if (grandParent.type !== ParseTreeTokenType.IDENTIFIER ||
		grandParent.val !== packageName)
			return false;
	}
	return true;
};