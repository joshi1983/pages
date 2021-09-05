import { Command } from
'../../Command.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { getProcedureStartToken } from
'../../parse-tree-analysis/getProcedureStartToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { tokenToProcedure } from
'../../parse-tree-analysis/tokenToProcedure.js';

function isForToken(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	return info.primaryName === 'for';
}

function isMakeOfInterest(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	if (info.primaryName === 'for')
		return forToVariableName(token) !== undefined;

	const first = children[0];
	if (!first.isStringLiteral())
		return false;

	return info !== undefined &&
		(info.primaryName === 'make' ||
		info.primaryName === 'localmake');
}

function forToVariableName(forToken) {
	// For example, for ["i 1 2] []
	// The variable name is in the for-loop settings token.
	// settings would represent the list: ["i 1 2].
	const settings = forToken.children[0];
	if (settings === undefined || settings.type !== ParseTreeTokenType.LIST)
		return;

	const nameToken = settings.children[1];
	if (nameToken === undefined || !nameToken.isStringLiteral())
		return;

	return nameToken.val.toLowerCase();
}

function makeToVariableName(makeToken) {
	if (isForToken(makeToken))
		return forToVariableName(makeToken);

	return makeToken.children[0].val.toLowerCase();
}

class VariablesInfo {
	constructor(nameInfoMap, variableName) {
		nameInfoMap.set(variableName, this);
		this.name = variableName;
		this.noProcMakes = [];
		this.localScopeStartTokens = [];
	}

	addProcedureStartToken(procedureStartToken) {
		this.localScopeStartTokens.push(procedureStartToken);
	}
}

class SingleDeclaration {
	// name should be the declared variable's name.
	// keyword should be 'let' or 'const'.
	constructor(name, keyword) {
		this.name = name;
		this.keyword = keyword;
	}
}

function hasMatchingName(singleDeclarations, name) {
	return singleDeclarations.some(d => d.name === name);
}

function getVariablesInfo(root, processOptions) {
	// find all variable assignments.
		// which ones should become declarations? const, let?
	let makes = getDescendentsOfType(root, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isMakeOfInterest);
	const makeToProcPairs = [];
	const startTokenToProcedure = new Map();
	const makesToRemove = new Set();
	const variablesNeedingDeclarations = new Map();
	
	for (const make of makes) {
		const proc = getProcedureStartToken(make);
		const variableName = makeToVariableName(make);
		let variableInfo = variablesNeedingDeclarations.get(variableName);
		if (proc === null) {
			if (variableInfo === undefined)
				variableInfo = new VariablesInfo(variablesNeedingDeclarations, variableName);

			variableInfo.noProcMakes.push(make);
		}
		else {
			let procedure = startTokenToProcedure.get(proc);
			if (procedure === undefined) {
				procedure = tokenToProcedure(proc);
				startTokenToProcedure.set(proc, procedure);
			}
			if (procedure.parameters.indexOf(variableName) === -1) {
				// Procedure parameters don't need declarations.
				// The procedure's parameter declaration is the local 
				// declaration of that variable for the whole procedure.
				makeToProcPairs.push(make, proc);
			}
			else {
				makesToRemove.add(make);
				if (variableInfo === undefined)
					variableInfo = new VariablesInfo(variablesNeedingDeclarations, variableName);
				variableInfo.addProcedureStartToken(proc);
			}
		}
	}
	if (makesToRemove.size !== 0) {
		makes = makes.filter(m => !makesToRemove.has(m));
	}
	return variablesNeedingDeclarations;
}

export function addDeclarationsToProcessOptions(root, processOptions) {
	const declarations = new Map();
	processOptions.declarations = declarations;
	const variables = getVariablesInfo(root);
	// FIXME: look for declarations that can be const.
	
	// FIXME: look for declarations that can be initialized immediately.

	// Declare every so far undeclared variable 
	// at the start of the instruction list or procedure.
	for (const variableInfo of variables.values()) {
		if (variableInfo.noProcMakes.length !== 0) {
			let declaration = declarations.get(root);
			if (declaration === undefined) {
				declaration = [];
				declarations.set(root, declaration);
			}
			if (!hasMatchingName(declaration, variableInfo.name))
				declaration.push(new SingleDeclaration(variableInfo.name, 'let'));
		}
		for (const startToken of variableInfo.localScopeStartTokens) {
			let declaration = declarations.get(startToken);
			if (declaration === undefined) {
				declaration = [];
				declarations.set(startToken, declaration);
			}
			declaration.push(new SingleDeclaration(variableInfo.name, 'let'));
		}
	}
};