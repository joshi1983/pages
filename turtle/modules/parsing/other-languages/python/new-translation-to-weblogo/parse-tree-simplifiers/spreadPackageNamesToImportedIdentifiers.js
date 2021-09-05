import { getClosestOfType } from
'../../../../generic-parsing-utilities/getClosestOfType.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { isMatchingAParameter } from
'../../parsing/parse-tree-analysis/isMatchingAParameter.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function addNames(token, toNames) {
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.children.length === 0) {
		toNames.add(token.val);
	}
	else {
		for (const child of token.children)
			addNames(child, toNames);
	}
}

function fromsToImports(importTokens) {
	for (const importToken of importTokens) {
		const fromToken = importToken.children[0];
		fromToken.val = 'import';
		fromToken.type = ParseTreeTokenType.IMPORT;
		while (importToken.children.length > 2)
			importToken.children[2].remove();
	}
}

function getImportInfo(importToken) {
	if (importToken.children.length < 4)
		return;

	const firstChild = importToken.children[0];
	if (firstChild.val !== 'from')
		return;

	let fromName;
	const secondChild = importToken.children[1];
	if (secondChild.type === ParseTreeTokenType.IDENTIFIER)
		fromName = secondChild.val;
	else
		return;

	const children = importToken.children;
	const toNames = new Set();
	for (let i = 2; i < children.length; i++) {
		addNames(children[i], toNames);
	}
	if (toNames.size === 0)
		return;

	return [fromName, toNames];
}

function isImportOfInterest(importToken) {
	return getImportInfo(importToken) !== undefined;
}

function isParameterOrVariableAssignedTo(token, variableName) {
	if (isMatchingAParameter(token, variableName))
		return true;

	return false;
}

function getPackageNameMap(root) {
	const imports = getDescendentsOfType(root,
		ParseTreeTokenType.IMPORT).filter(isImportOfInterest);

	const identifierToPackageMap = new Map();
	const importsOfInterest = [];
	for (const importToken of imports) {
		const pair = getImportInfo(importToken);
		if (pair !== undefined) {
			const packageName = pair[0];
			importsOfInterest.push(importToken);
			for (const identifierName of pair[1]) {
				identifierToPackageMap.set(identifierName, packageName);
			}
		}
	}
	return [identifierToPackageMap, importsOfInterest];
}

function isOfInterest(identifierToPackageMap) {
	return function(token) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.DOT)
			return false; // already in a property expression so not of interest.
			// for example, x.y

		if (!identifierToPackageMap.has(token.val))
			return false;

		if (isParameterOrVariableAssignedTo(token, token.val))
			return false;

		const closestImportToken = getClosestOfType(token, ParseTreeTokenType.IMPORT);
		if (closestImportToken !== null)
			return false;

		return true;
	};
}

export function spreadPackageNamesToImportedIdentifiers(root) {
	const [identifierToPackageMap, importTokens] = getPackageNameMap(root);
	const tokens = getDescendentsOfTypes(root, [
		ParseTreeTokenType.FUNCTION_CALL,
		ParseTreeTokenType.IDENTIFIER
	]).filter(isOfInterest(identifierToPackageMap));
	if (tokens.length > 0) {
		fromsToImports(importTokens);
		tokens.forEach(function(token) {
			const parent = token.parentNode;
			const dotToken = new ParseTreeToken('.', token.lineIndex, token.colIndex,
				ParseTreeTokenType.DOT);
			const packageName = identifierToPackageMap.get(token.val);
			const packageNameToken = new ParseTreeToken(packageName, token.lineIndex, token.colIndex,
				ParseTreeTokenType.IDENTIFIER);
			packageNameToken.appendChild(dotToken);
			parent.replaceChild(token, packageNameToken);
			token.remove();
			dotToken.appendChild(token);
		});
	}
	return tokens.length !== 0;
};