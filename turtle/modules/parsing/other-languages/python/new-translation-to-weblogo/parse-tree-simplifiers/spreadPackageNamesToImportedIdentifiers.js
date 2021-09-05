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
import { PythonFunctions } from
'../../PythonFunctions.js';
import { SetUtils } from
'../../../../../SetUtils.js';

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

function isImportingFromAstrix(importToken) {
	const children = importToken.children;
	if (children.length !== 4)
		return false;

	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER ||
	firstChild.val !== 'from' ||
	firstChild.children.length !== 0)
		return false;

	const packageNameToken = children[1];
	if (packageNameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	packageNameToken.children.length !== 0 ||
	PythonFunctions.getPackageInfo(packageNameToken.val) === undefined)
		return false;
	
	const importToken2 = children[2];
	if (importToken2.type !== ParseTreeTokenType.IMPORT ||
	importToken2.children.length !== 0)
		return false;

	const astrix = children[3];
	if (astrix.type !== ParseTreeTokenType.ASTRIX_WILDCARD ||
	astrix.children.length !== 0)
		return false;
	
	return true;
}

function getImportInfo(importToken) {
	if (importToken.children.length < 4)
		return;

	const firstChild = importToken.children[0];
	if (firstChild.val !== 'from')
		return;

	let packageName;
	const secondChild = importToken.children[1];
	if (secondChild.type === ParseTreeTokenType.IDENTIFIER)
		packageName = secondChild.val;
	else
		return;

	const toNames = new Set();
	if (isImportingFromAstrix(importToken)) {
		const packageInfo = PythonFunctions.getPackageInfo(packageName);
		SetUtils.addAll(toNames, packageInfo.identifiers);
	}
	else {
		const children = importToken.children;
		for (let i = 2; i < children.length; i++) {
			addNames(children[i], toNames);
		}
	}
	if (toNames.size === 0)
		return;

	return [packageName, toNames];
}

function isImportOfInterest(importToken) {
	if (isImportingFromAstrix(importToken))
		return true;
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
		
		if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		parent.children[0] === token)
			return false;
			/*
			For example:
			from math import *
			pi = 4
			We don't want to replace the pi = 4 with math.pi = 4.
			*/

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

function filterVariableReadTokens(tokens, root) {
	const declaredNames = new Set();
	const declarations = getDescendentsOfTypes(root, 
		[ParseTreeTokenType.ASSIGNMENT_OPERATOR,
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.FUNCTION_DEFINITION]);
	for (const declaration of declarations) {
		let child = declaration.children[0];
		if (child !== undefined) {
			if (declaration.type === ParseTreeTokenType.FUNCTION_DEFINITION)
				child = declaration.children[1];

			if (child.type === ParseTreeTokenType.IDENTIFIER &&
			child.children.length === 0 &&
			!isMatchingAParameter(declaration, child.val)) {
				declaredNames.add(child.val);
			}
		}
	}
	
	return tokens.filter(t => !declaredNames.has(t.val));
}

export function spreadPackageNamesToImportedIdentifiers(root) {
	const [identifierToPackageMap, importTokens] = getPackageNameMap(root);
	let tokens = getDescendentsOfTypes(root, [
		ParseTreeTokenType.FUNCTION_CALL,
		ParseTreeTokenType.IDENTIFIER
	]).filter(isOfInterest(identifierToPackageMap));
	if (tokens.length > 0) {
		tokens = filterVariableReadTokens(tokens, root);
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
	}
	return tokens.length !== 0;
};