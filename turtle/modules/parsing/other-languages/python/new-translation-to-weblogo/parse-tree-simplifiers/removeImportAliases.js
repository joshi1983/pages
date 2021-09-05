import { getClosestOfType } from
'../../../../generic-parsing-utilities/getClosestOfType.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isMatchingAParameter } from
'../../parsing/parse-tree-analysis/isMatchingAParameter.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function getAliasPairFromImport(importToken) {
	const asToken = importToken.children[1];
	if (asToken === undefined ||
	asToken.type !== ParseTreeTokenType.AS ||
	asToken.children.length !== 2)
		return;

	const fromToken = asToken.children[0];
	if (fromToken.type !== ParseTreeTokenType.IDENTIFIER ||
	fromToken.children.length !== 0)
		return;

	const fromName = fromToken.val;
	const alias = asToken.children[1].val;
	return [fromName, alias];
}

function mightBePackageAliasToRename(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.FUNCTION_DEFINITION ||
	parent.type === ParseTreeTokenType.DOT ||
	parent.type === ParseTreeTokenType.CLASS)
		return false;
		// for example, x in class x: would not be a package name.
		// x in def x(): also would not be a package name.
		// x in p.x would not be a package name.

	const closestImport = getClosestOfType(token, ParseTreeTokenType.IMPORT);
	if (closestImport !== null)
		return false;
		// for example, import math as x
		// x would not be a package name that we want to rename.

	if (isMatchingAParameter(token, token.val))
		return false;

	return true;
}

function isOfInterest(token) {
	const children = token.children;
	const firstChild = children[0];
	if (firstChild === undefined ||
	firstChild.type !== ParseTreeTokenType.IMPORT)
		return false;

	const pair = getAliasPairFromImport(token);
	return pair !== undefined;
}

/*
Statements like:
import numpy as np
complicate matching of function/method calls and properties to information on the package.
*/
export function removeImportAliases(root) {
	const imports = getDescendentsOfType(root, ParseTreeTokenType.IMPORT).filter(isOfInterest);
	if (imports.length === 0)
		return false;

	const aliasMap = new Map();
	for (const importToken of imports) {
		const [originalPackageName, alias] = getAliasPairFromImport(importToken);
		aliasMap.set(alias, originalPackageName);
	}
	const tokensToRename = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).
		filter(t => aliasMap.has(t.val) && mightBePackageAliasToRename(t));
	if (tokensToRename.length === 0)
		return false;
	
	imports.forEach(function(importToken) {
		const asToken = importToken.children[1];
		const aliasToken = asToken.children[1];
		aliasToken.remove();
		asToken.removeSingleToken();
	});
	tokensToRename.forEach(function(tokenToRename) {
		tokenToRename.val = aliasMap.get(tokenToRename.val);
	});
	return true;
};