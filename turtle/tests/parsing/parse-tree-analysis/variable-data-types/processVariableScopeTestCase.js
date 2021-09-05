import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { findToken } from '../../../helpers/findToken.js';
import { getAnalyzedVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function getTokenDescription(token) {
	return `Actual val=${token.val}, Actual type=${ParseTreeTokenType.getNameFor(token.type)}, actual toString = ${token.toString()}`;
}

export function processVariableScopeTestCase(caseInfo, index, logger) {
	const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
	const variables = getAnalyzedVariables(cachedParseTree);
	caseInfo.scopeChecks.forEach(function(scopeCheck) {
		const variable = variables.getVariableByName(scopeCheck.varName);
		const plogger = prefixWrapper(`Case ${index}. Code = ${caseInfo.code}`, logger);
		if (variable === undefined)
			plogger(`Expected to find a variable with name ${scopeCheck.varName} but it was not found`);
		else {
			if (scopeCheck.scopes.length > variable.scopes.length)
				plogger(`Expected at least ${scopeCheck.scopes.length} scopes but got ${variable.scopes.length}`);
			scopeCheck.scopes.forEach(function(scopeInfo, index) {
				const varScope = variable.scopes[index];
				const pplogger = prefixWrapper(`Scope check ${index}`, plogger);
				if (scopeInfo.assignTokenVal !== undefined) {
					if (varScope.assignToken === undefined)
						pplogger(`assignToken.val expected to be ${scopeInfo.assignTokenVal} but found no assignToken.`);
					else if (varScope.assignToken.val !== scopeInfo.assignTokenVal)
						pplogger(`assignToken.val expected to be ${scopeInfo.assignTokenVal} but got ${varScope.assignToken.val}.`);
				}
				if (scopeInfo.toToken !== undefined) {
					const matchedToken = findToken(scopeInfo.toToken, cachedParseTree, prefixWrapper('Looking for toToken', pplogger));
					if (matchedToken !== undefined && matchedToken !== varScope.toToken)
						pplogger(`Expected to token matching ${JSON.stringify(scopeInfo.toToken)} but got something different.  ${getTokenDescription(varScope.toToken)}`);
				}
				if (scopeInfo.fromToken !== undefined) {
					const matchedToken = findToken(scopeInfo.fromToken, cachedParseTree, prefixWrapper('Looking for fromToken', pplogger));
					if (matchedToken !== undefined && matchedToken !== varScope.fromToken)
						pplogger(`Expected from token matching ${JSON.stringify(scopeInfo.fromToken)} but got something different.  ${getTokenDescription(varScope.fromToken)}`);
				}
				if (scopeInfo.singleValue !== undefined) {
					if (!DeepEquality.equals(scopeInfo.singleValue, varScope.singleValue))
						pplogger(`Expected a singleValue of "${scopeInfo.singleValue}" but got "${varScope.singleValue}"`);
				}
				if (scopeInfo.assignedTypes !== undefined) {
					const typesStr = varScope.assignedTypes.toString();
					if (scopeInfo.assignedTypes !== typesStr)
						pplogger(`Expected assignedTypes to be ${scopeInfo.assignedTypes} but got ${typesStr}`);
				}
				if (scopeInfo.isParameter !== undefined) {
					if (scopeInfo.isParameter !== varScope.isParameter)
						pplogger(`Expected isParameter to be ${scopeInfo.isParameter} but got ${varScope.isParameter}`);
				}
			});
		}
	});
};