import { getLastDescendentTokenOf } from '../../../parse-tree-token/getLastDescendentTokenOf.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const nonInstructionTypes = new Set([
	ParseTreeTokenType.LEAF,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
]);

function getScopeTo(varNameToken, variables, cachedParseTree) {
	const swapToken = varNameToken.parentNode;
	const varNameIndex = swapToken.children.indexOf(varNameToken);
	const otherVarNameToken = swapToken.children[(1 + varNameIndex) % 2];
	const otherVariable = variables.getVariableByName(otherVarNameToken.val.toLowerCase());
	const proc = cachedParseTree.getProcedureAtToken(swapToken);
	const scopes = otherVariable.getScopesAt(swapToken, proc);
	if (scopes.length === 1) {
		return scopes[0];
	}
}

function equalProcedures(proc1, proc2) {
	if (proc1 === proc2)
		return true;
	if ((proc1 === undefined) !== (proc2 === undefined))
		return false;
	return proc1.name === proc2.name;
}

function getScopeFrom(varName, fromToken, variables, cachedParseTree) {
	const variable = variables.getVariableByName(varName);
	const proc = cachedParseTree.getProcedureAtToken(fromToken);
	const scopes = variable.scopes.filter(s => s.fromToken === fromToken && equalProcedures(proc, s.procedure));
	if (scopes.length === 1) {
		return scopes[0];
	}
}

function isSwapCallOfInterest(variables) {
	return function(swapCall) {
		if (swapCall.children.length !== 2)
			return false;
		return swapCall.children.every(c => c.isStringLiteral() && variables.getVariableByName(c.val.toLowerCase()) !== undefined);
	};
}

function isNoninstructionToken(token) {
	if (token === null)
		return true;
	return nonInstructionTypes.has(token.type);
}

function getAfterToken(swapCall) {
	const nextToken = swapCall.nextSibling;
	if (isNoninstructionToken(nextToken))
		return getLastDescendentTokenOf(swapCall);
	else
		return nextToken;
}

export function propogateSwappedValues(cachedParseTree, variables) {
	const swapCalls = cachedParseTree.getCommandCallsByName('swap').filter(isSwapCallOfInterest(variables));
	if (swapCalls.length !== 0) {
		swapCalls.forEach(function(swapCall) {
			let afterToken = getAfterToken(swapCall);
			for (let i = 0; i < 2; i++) {
				const varNameToken = swapCall.children[i];
				const previousScope = getScopeTo(varNameToken, variables, cachedParseTree);
				if (previousScope !== undefined) {
					const nextScope = getScopeFrom(varNameToken.val.toLowerCase(), afterToken, variables, cachedParseTree);
					if (nextScope !== undefined) {
						nextScope.assignedTypes = previousScope.assignedTypes.deepClone();
						nextScope.singleValue = previousScope.singleValue;
						previousScope.requiredTypes.intersectWith(nextScope.requiredTypes);
					}
				}
			}
		});
	}
};