import { Command } from '../../../../parsing/Command.js';
import { fixDynamicScopes } from './helpers/fixDynamicScopes.js';
import { getAllDescendentsAsArray } from '../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getProcedureStartToken } from '../../../../parsing/parse-tree-analysis/getProcedureStartToken.js';
import { isMutationCommand } from '../../../../parsing/parse-tree-analysis/variable-data-types/isMutationCommand.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { tokenToProcedure } from '../../../../parsing/parse-tree-analysis/tokenToProcedure.js';
import { tokenToVarName } from './helpers/tokenToVarName.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';
await Command.asyncInit();

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'local' ||
	token.nextSibling === null ||
	!token.nextSibling.isStringLiteral())
		return false;
	if (validateIdentifier(token.nextSibling.val) !== undefined)
		return false; // no interest in invalid variable names

	const procStartToken = getProcedureStartToken(token);
	if (procStartToken === undefined)
		return false;
	return procStartToken.children.length > 2;
}

function getVariableReferences(procedureTokens, lowerCaseNames) {
	const result = [];
	for (let i = 0; i < procedureTokens.length; i++) {
		const token = procedureTokens[i];
		if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(token.val);
			if (info !== undefined && isMutationCommand(info)) {
				const varName = tokenToVarName(token, info);
				if (lowerCaseNames.has(varName))
					result.push(token);
			}
		}
	}
	return result;
}

/*
Checks if localToken is part of a parsed expression for code like: (local "x "y "z)
*/
function isCurvedBracketExpression(localToken) {
	let t = localToken.nextSibling;
	// Make sure all following siblings are string literals because they must be variable names.
	while (t !== null) {
		// Check for the last ')' in a curved bracket expression.
		if (t.val === ')' && t.type === ParseTreeTokenType.LEAF &&
		t === localToken.parentNode.children[localToken.parentNode.children.length - 1])
			break;
		if (!t.isStringLiteral())
			return false;
		t = t.nextSibling;
	}
	return localToken.parentNode !== null &&
	localToken.parentNode.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	localToken.parentNode.children.indexOf(localToken) === 1;
}

function processCurvedBracketExpression(cachedParseTree, localToken) {
	const varNames = [];
	let t = localToken.nextSibling;
	let tokensToRemove = [];
	while (t !== null) {
		if (t.isStringLiteral())
			varNames.push(t.val.toLowerCase());
		const previousToken = t;
		t = t.nextSibling;
		previousToken.remove();
		tokensToRemove.push(previousToken);
	}
	const curvedBracketExpressionToken = localToken.parentNode;
	const openBracketToken = localToken.previousSibling;
	localToken.remove();
	curvedBracketExpressionToken.remove();
	tokensToRemove.push(localToken);
	tokensToRemove.push(curvedBracketExpressionToken);
	if (openBracketToken !== null) {
		openBracketToken.remove();
		tokensToRemove.push(openBracketToken);
	}
	cachedParseTree.tokensRemoved(tokensToRemove);
	return varNames;
}

export function localFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (tokens.length === 0)
		return; // nothing to fix.
	tokens.forEach(function(localToken) {
		// get the procedure token.
		const procStartToken = getProcedureStartToken(localToken);
		const procedure = tokenToProcedure(procStartToken);
		const procedureTokens = getAllDescendentsAsArray(procedure.getInstructionListToken());
		const procName = procedure.name;
		let vars;
		if (isCurvedBracketExpression(localToken)) {
			vars = processCurvedBracketExpression(cachedParseTree, localToken);
			fixLogger.log(`Removed declaration of local variables ${vars.join(',')} from procedure ${procName} because WebLogo does not use the local command`, localToken);
		}
		else {
			const varNameToken = localToken.nextSibling;
			const varName = varNameToken.val.toLowerCase();
			vars = [varName];
			varNameToken.remove();
			localToken.remove();
			cachedParseTree.tokensRemoved([varNameToken, localToken]);
			fixLogger.log(`Removed declaration of local variable ${varNameToken.val} from procedure ${procName} because WebLogo does not use the local command`, localToken);
		}
		vars = new Set(vars);
		const varReferences = getVariableReferences(procedureTokens, vars);
		varReferences.forEach(function(varReferenceToken) {
			const info = Command.getCommandInfo(varReferenceToken.val);
			if (info.primaryName === 'make') {
				// change any associated 'make' to 'localmake'.
				const oldVal = varReferenceToken.val;
				varReferenceToken.val = 'localmake';
				cachedParseTree.tokenValueChanged(varReferenceToken, oldVal);
			}
		});
	});
	fixDynamicScopes(cachedParseTree, fixLogger);
};