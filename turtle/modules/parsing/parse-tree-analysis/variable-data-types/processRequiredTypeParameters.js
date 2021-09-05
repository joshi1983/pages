import { Command } from '../../Command.js';
import { CommandDataTypes } from '../CommandDataTypes.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { evaluateTokensBasic } from './evaluateTokensBasic.js';
import { getRequiredTypesFromAssertion } from
'./variable-assignment-scopes/getRequiredTypesFromAssertion.js';
import { getTokensByType } from
'../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processIndexRequiredTypes } from './processIndexRequiredTypes.js';
import { processRequiredTypes } from './processRequiredTypes.js';
await Command.asyncInit();
await DataTypes.asyncInit();

const primaryNames = CommandDataTypes.getCommandNamesWhereRequiredParameterTypesAffectEachOther();
primaryNames.push('assert');

function processVariableReads(cachedParseTree, tokenTypesMap, tokenValuesMap, variables) {
	const variableReads = getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ);
	variableReads.forEach(function(variableRead) {
		const variable = variables.getVariableByName(variableRead.val.toLowerCase());
		if (variable !== undefined) {
			const procedure = cachedParseTree.getProcedureAtToken(variableRead);
			const scopes = variable.getScopesAt(variableRead, procedure);
			if (scopes.length !== 0) {
				for (const scope of scopes) {
					processRequiredTypes(variableRead, scope.requiredTypes, variables, procedure);
					processIndexRequiredTypes(variableRead, scope.requiredTypes, tokenValuesMap);
				}
			}
		}
	});
}

export function processRequiredTypeParameters(cachedParseTree, tokenTypesMap, variables) {
	const callTokens = cachedParseTree.getCommandCallsByNames(primaryNames);
	const allTypes = DataTypes.getAllTypesString();
	const tokenValuesMap = evaluateTokensBasic(cachedParseTree);
	processVariableReads(cachedParseTree, tokenTypesMap, tokenValuesMap, variables);
	callTokens.forEach(function(callToken) {
		const containingProc = cachedParseTree.getProcedureAtToken(callToken);
		const info = Command.getCommandInfo(callToken.val);
		if (info.primaryName === 'assert') {
			const varTypes = getRequiredTypesFromAssertion(callToken, cachedParseTree, tokenTypesMap, tokenValuesMap);
			for (const [key, value] of varTypes) {
				const variable = variables.getVariableByName(key);
				if (variable !== undefined) {
					const scopes = variable.getScopesAt(callToken, containingProc);
					for (let i = 0; i < scopes.length; i++) {
						const scope = scopes[i];
						scope.requiredTypes.intersectWith(value);
					}
				}
			}
		}
		else {
			const primaryName = info.primaryName;
			function getParameterTypes(index) {
				let result = tokenTypesMap.get(callToken.children[index]);
				if (result === undefined)
					result = allTypes;
				else
					return result.toString();
			}
			for (let i = 0; i < callToken.children.length; i++) {
				const requiredTypes = CommandDataTypes.getRequiredParameterTypes(primaryName, i, getParameterTypes);
				processRequiredTypes(callToken.children[i], requiredTypes, variables, containingProc);
			}
		}
	});
};