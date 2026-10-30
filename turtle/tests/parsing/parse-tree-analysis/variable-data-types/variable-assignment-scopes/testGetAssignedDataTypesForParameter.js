import { analyzeTokenDataTypes } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/analyzeTokenDataTypes.js';
import { DataTypes } from
'../../../../../modules/parsing/data-types/DataTypes.js';
import { evaluateTokensBasic } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { getAssignedDataTypesForParameter } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/getAssignedDataTypesForParameter.js';
import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { Variables } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/Variables.js';
await DataTypes.asyncInit();

export function testGetAssignedDataTypesForParameter(logger) {
	const cases = [
	{'code': `to p :x
		output :x * 2
	end`, 'out': 'num'},
	{'code': `to p :x
		output count :x
	end`, 'out': 'list|string'},
	{'code': `to p :x
		output count :x
	end
print p []`, 'out': 'list'},
	{'code': `to p :x
		output count :x
	end
print p "hi`, 'out': 'string'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger, true);
		const variable = cachedParseTree.getVariables().getVariableByName('x');
		if (variable === undefined) {
			plogger(`Expected to find variable with name x but not found`);
			return;
		}
		const variableScopes = variable.scopes.filter(scope => scope.isParameter === true);
		if (variableScopes.length !== 1) {
			plogger(`Expected to find exactly 1 scope for variable x parameter but found ${variableScopes.length}`);
			return;
		}
		const variableScope = variableScopes[0];
		const tokenValueMap = evaluateTokensBasic(cachedParseTree);
		const variables = new Variables();
		const tokenTypesMap = analyzeTokenDataTypes(cachedParseTree, tokenValueMap, variables);
		const result = getAssignedDataTypesForParameter(cachedParseTree, variableScope, tokenTypesMap);
		const resultStr = DataTypes.stringify(result);
		if (resultStr !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${resultStr}`);
	});
};