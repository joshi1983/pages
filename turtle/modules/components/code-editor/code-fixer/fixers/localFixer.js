import { Command } from '../../../../parsing/Command.js';
import { fixDynamicScopes } from './helpers/fixDynamicScopes.js';
import { getAllDescendentsAsArray } from '../../../../parsing/parse-tree-token/getAllDescendentsAsArray.js';
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

function getVariableReferences(procedureTokens, lowerCaseName) {
	const result = [];
	for (let i = 0; i < procedureTokens.length; i++) {
		const token = procedureTokens[i];
		if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(token.val);
			if (info !== undefined && isMutationCommand(info)) {
				const varName = tokenToVarName(token, info);
				if (varName === lowerCaseName)
					result.push(token);
			}
		}
	}
	return result;
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
		const procName = procedure.name;
		const varNameToken = localToken.nextSibling;
		const varName = varNameToken.val.toLowerCase();
		const procedureTokens = getAllDescendentsAsArray(procedure.getInstructionListToken());
		const varReferences = getVariableReferences(procedureTokens, varName);
		varNameToken.remove();
		localToken.remove();
		cachedParseTree.tokensRemoved([varNameToken, localToken]);
		fixLogger.log(`Removed declaration of local variable ${varNameToken.val} from procedure ${procName} because WebLogo does not use the local command`, localToken);
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