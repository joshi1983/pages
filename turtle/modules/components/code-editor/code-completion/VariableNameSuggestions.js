import { Command } from '../../../parsing/Command.js';
import { getBestCaseFromTokens } from '../harmonize-case/getBestCaseFromTokens.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
import { tokenToVarNameToken } from '../code-fixer/fixers/helpers/tokenToVarNameToken.js';
await Command.asyncInit();

function mightBeReadAtToken(cachedParseTree, token) {
	const procedure = cachedParseTree.getProcedureAtToken(token);
	return function(scope) {
		return scope.contains(token, procedure);
	};
}

function matchesPrefixFromToken(token, position) {
	let prefix = token.val.toLowerCase();
	const offset = position.colIndex - token.colIndex;
	if (offset > 0 && offset < prefix.length)
		prefix = prefix.substring(0, prefix.length + 1 - offset);
	return function(scope) {
		const varName = scope.variable.name;
		if (varName.startsWith(prefix))
			return true;
		return false;
	};
}

function getVarNameToken(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		return tokenToVarNameToken(token, info);
	}
	return token;
}

function getAllTokensForVariable(varReads, variable) {
	const scopes = variable.getScopesArray();
	const result = varReads.filter(t => t.val.toLowerCase() === variable.name);
	for (const scope of scopes) {
		result.push(getVarNameToken(scope.assignToken));
	}
	return result;
}

export class VariableNameSuggestions {
	static isApplicableToToken(token) {
		if (token.type === ParseTreeTokenType.VARIABLE_READ)
			return true;
		return false;
	}

	static getSuggestions(cachedParseTree, token, position) {
		// get currently typed variable name at position.
		const variables = cachedParseTree.getVariables();
		const scopesAtToken = variables.getAllScopesAsArray().
			filter(mightBeReadAtToken(cachedParseTree, token)).
			filter(matchesPrefixFromToken(token, position));
		const distinctVariables = new Set(scopesAtToken.map(s => s.variable.name));
		// get the best case for each variable name.
		const result = [];
		const varReads = cachedParseTree.getTokensByTypes([ParseTreeTokenType.VARIABLE_READ]);
		for (const varName of distinctVariables) {
			const varTokens = getAllTokensForVariable(varReads, variables.getVariableByName(varName));
			const caseName = getBestCaseFromTokens(varTokens);
			result.push(caseName);
		}
		result.sort();
		return result;
	}
};