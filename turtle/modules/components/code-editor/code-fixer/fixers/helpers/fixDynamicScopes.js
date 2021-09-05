import { BufferedParseLogger } from '../../../../../parsing/loggers/BufferedParseLogger.js';
import { CachedParseTree } from '../../../../../parsing/parse-tree-analysis/CachedParseTree.js';
import { Command } from '../../../../../parsing/Command.js';
import { getAllVariableReferences } from './getAllVariableReferences.js';
import { getLastDescendentTokenOf } from '../../../../../parsing/parse-tree-token/getLastDescendentTokenOf.js';
import { getTokensByType } from '../../../../../parsing/generic-parsing-utilities/getTokensByType.js';
import { insertColIndexSpanAt } from '../../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { ParseTreeToken } from '../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { tokenToVarName } from './tokenToVarName.js';
import { getParametersFromStartToken } from
'../../../../../parsing/parse-tree-analysis/tokenToProcedure.js';
import { validateIdentifier } from '../../../../../parsing/parse-tree-analysis/validateIdentifier.js';
import { validateUndeclaredVariableRead } from '../../../../../parsing/parse-tree-analysis/validation/validateUndeclaredVariableRead.js';
await Command.asyncInit();

/*
We don't want this run often for a few reasons:
- The performance tends to be slower than a normal code fixer
because we're using a read-optimized cached parse tree instead of a write-optimized cache parse tree.
- This will mutate code more aggressively than other code fixers.
This has a higher risk of making code changes that are counter-productive unless fixDynamicScopes is called only in special cases.

For the above reasons, fixDynamicScopes should not be applied to the tree unless there are
strong indicators that the code was from another Logo interpreter that supports dynamic variable scopes.

A strong indicator would be something like usage of the 'local' command which is not supported by WebLogo but
is supported by most Logo interpreters using dynamic scopes.
*/

function isOfInterest(readOptimizedCachedParseTree) {
	return function(token) {
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP &&
		token.type !== ParseTreeTokenType.VARIABLE_READ)
			return false;
		if (validateIdentifier(token.val) !== undefined)
			return false;
		const procedure = readOptimizedCachedParseTree.getProcedureAtToken(token);
		if (procedure === undefined)
			return false; // we don't care about tokens outside of procedures.
		if (!procedure.nameToken)
			return false;
		const parametersToken = procedure.nameToken.nextSibling;
		if (parametersToken === null)
			return false;
		const instructionsToken = parametersToken.nextSibling;
		if (instructionsToken === null || instructionsToken.type !== ParseTreeTokenType.LIST)
			return false;
		return parametersToken.type === ParseTreeTokenType.LIST;
	}
}

function tokenToVariableName(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return token.val.toLowerCase();
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return;
	return tokenToVarName(token, info);
}

function procedureAndVariableNameToKey(proc, varName) {
	return proc.name + '-' + varName;
}

function processToken(wCachedParseTree, fixLogger, readOptimizedCachedParseTree, processedKeys, procedureCallTokens, newTokensOfInterest) {
	return function(token) {
		const procedure = readOptimizedCachedParseTree.getProcedureAtToken(token);
		const procedureName = procedure.name;
		const varName = tokenToVariableName(token);
		if (procedure.parameters.indexOf(varName) !== -1)
			return; // already processed.
		const key = procedureAndVariableNameToKey(procedure, varName);
		if (processedKeys.has(key))
			return; // already processed
		processedKeys.add(key);
		const variable = readOptimizedCachedParseTree.getVariables().getVariableByName(varName);
		const parameterListToken = procedure.nameToken.nextSibling;
		let lastParamToken = parameterListToken;
		if (lastParamToken.children.length !== 0)
			lastParamToken = lastParamToken.children[lastParamToken.children.length - 1];
		// add parameter token for varName.
		const paramToken = new ParseTreeToken(varName, null, lastParamToken.lineIndex,
			lastParamToken.colIndex + varName.length + 2, ParseTreeTokenType.VARIABLE_READ);
		parameterListToken.appendChild(paramToken);
		// loop through calls to the procedure.
		const callTokens = procedureCallTokens.filter(p => p.val.toLowerCase() === procedureName);
		callTokens.forEach(function(callToken) {
			// check if callToken was removed by earlier processing.
			const procedure = readOptimizedCachedParseTree.getProcedureAtToken(callToken);
			if (procedure === undefined) {
				const oldType = callToken.type;
				if (oldType !== ParseTreeTokenType.LEAF) {
					callToken.type = ParseTreeTokenType.LEAF;
					wCachedParseTree.tokenTypeChanged(callToken, oldType);
					// change any children of callToken into next siblings.
					const children = callToken.children;
					for (let i = children.length - 1; i >= 0; i--) {
						const child = children[i];
						child.remove();
						callToken.appendSibling(child);
					}
				}
			}
			else {
				let lastToken = getLastDescendentTokenOf(callToken);
				insertColIndexSpanAt(lastToken, varName.length + 1);
				const newToken = new ParseTreeToken(varName, null, lastToken.lineIndex, lastToken.colIndex + varName.length + 2, ParseTreeTokenType.VARIABLE_READ);
				callToken.appendChild(newToken);
				wCachedParseTree.tokenAdded(newToken);
				if ((variable === undefined || variable.getLocalScopesAt(newToken).length === 0) &&
				isOfInterest(readOptimizedCachedParseTree)(newToken))
					newTokensOfInterest.push(newToken);
			}
		});
		wCachedParseTree.tokenAdded(paramToken);

		// refresh the parameters in cached Procedures.
		procedure.parameters = getParametersFromStartToken(procedure.getStartToken(), new Map());
		const wProc = wCachedParseTree.getProceduresMap().get(procedureName);
		if (wProc !== undefined)
			wProc.parameters = getParametersFromStartToken(wProc.getStartToken(), new Map());
		fixLogger.log(`Added parameter ${varName} to procedure ${procedure.name} to remove dependency on dynamic variable scopes.`, token);
	};
}

function isProcedureCallOfInterest(readOptimizedCachedParseTree) {
	return function(token) {
		return Command.getCommandInfo(token.val) === undefined;
	};
}

function getVariableReferenceCounts(wCachedParseTree) {
	const variableReferenceCounts = new Map();
	for (const varRef of getAllVariableReferences(wCachedParseTree)) {
		const name = varRef.val.toLowerCase();
		let count = variableReferenceCounts.get(name);
		if (count === undefined)
			count = 0;
		variableReferenceCounts.set(name, count + 1);
	}
	return variableReferenceCounts;
}

function isVariableReferencedAnywhereElse(variableReferenceCounts) {
	return function(varRef) {
		const name = varRef.val.toLowerCase();
		return variableReferenceCounts.get(name) > 1;
	};
}

export function fixDynamicScopes(wCachedParseTree, fixLogger) {
	const initialVariablesMap = new Map();
	const proceduresMap = wCachedParseTree.proceduresMap;
	const readOptimizedCachedParseTree = new CachedParseTree(wCachedParseTree.root, proceduresMap, initialVariablesMap);
	const parseLogger = new BufferedParseLogger();
	validateUndeclaredVariableRead(readOptimizedCachedParseTree, parseLogger);
	let tokensOfInterest = parseLogger._messages.map(m => m.token).
		filter(isOfInterest(readOptimizedCachedParseTree));
	if (tokensOfInterest.length === 0)
		return;

	// If this was from code that really used dynamic scopes,
	// there would be more than 1 reference to each dynamically scoped variable.
	// Filter down to those to avoid changes that are unlikely to be related to dynamic variable scopes.
	const variableReferenceCounts = getVariableReferenceCounts(wCachedParseTree);
	tokensOfInterest = tokensOfInterest.filter(isVariableReferencedAnywhereElse(variableReferenceCounts));
	if (tokensOfInterest.length === 0)
		return;

	const processedKeys = new Set();
	const procedureCallTokens = getTokensByType(readOptimizedCachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isProcedureCallOfInterest(readOptimizedCachedParseTree));
	let newTokensOfInterest;
	do {
		newTokensOfInterest = [];
		tokensOfInterest.forEach(processToken(wCachedParseTree, fixLogger, readOptimizedCachedParseTree, processedKeys, procedureCallTokens, newTokensOfInterest));
		tokensOfInterest = newTokensOfInterest;
	} while (tokensOfInterest.length !== 0);
};