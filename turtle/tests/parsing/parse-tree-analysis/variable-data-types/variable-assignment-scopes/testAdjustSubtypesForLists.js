import { addScopesForParameters } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/addScopesForParameters.js';
import { addVariablesFromInitialVariables } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/addVariablesFromInitialVariables.js';
import { adjustSubtypesForLists } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/adjustSubtypesForLists.js';
import { addVariableAssignmentScopes } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/addVariableAssignmentScopes.js';
import { analyzeTokenDataTypes } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/analyzeTokenDataTypes.js';
import { DataTypes } from '../../../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from
'../../../../helpers/escapeHTML.js';
import { evaluateTokensBasic } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { getAllVariables } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAllVariables.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { Variables } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/Variables.js';

function unionAssignedTypes(variable) {
	const unionedTypes = new DataTypes('');
	if (variable.scopes.some(s => s.assignedTypes === undefined))
		return new DataTypes('*');
	variable.scopes.forEach(function(scope) {
		if (scope.assignedTypes === undefined)
			throw new Error(`Very weird!`);
		unionedTypes.addTypes(scope.assignedTypes);
	});
	return unionedTypes;
}

export function testAdjustSubtypesForLists(logger) {
	const cases = [
	/*'',
	'fd 100',
	{'code': 'make "x 1', 'checks': [
		{'varName': 'x', 'types': 'int'}
	]},
	'make "x "hi',
	{'code': 'make "x []\nprint :x', 'types': 'list'},
	{'code': 'make "x [1]\nprint item 1 :x', 'types': 'list<int>'},
	*/{'code': 'make "x [1]\nqueue2 "x "hi', 'checks': [
		{'varName': 'x', 'beforeTypes': 'list<int>', 'types': 'list<int|string>'}
	]},
	/*{'code': 'make "x [1]\nsetItem 2 "hi\nprint item 1 :x',
	'checks': [
		{
			'varName': 'x',
			'beforeTypes': 'list<int>',
			'types': 'list<int|string>'
		}
	]}*/
	];
	cases.forEach(function(caseInfo, index) {
		const code = typeof caseInfo === 'string' ? caseInfo : caseInfo.code;
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(code, plogger);
		const variables = getAllVariables(cachedParseTree);
		const basicTokenValuesMap = evaluateTokensBasic(cachedParseTree);
		addVariablesFromInitialVariables(cachedParseTree, variables);
		addScopesForParameters(variables, cachedParseTree);
		addVariableAssignmentScopes(cachedParseTree, variables);
		if (caseInfo.checks !== undefined) {
			caseInfo.checks.filter(c => c.beforeTypes !== undefined).
			forEach(function(checkInfo, cIndex) {
				const clogger = prefixWrapper(`Check ${cIndex} before calling adjustSubtypesForLists`, plogger);
				const variable = variables.getVariableByName(checkInfo.varName);
				if (variable === undefined)
					clogger(`Expected to get a variable named ${checkInfo.varName} but not found`);
				else {
					const unionedTypes = unionAssignedTypes(variable);
					if (unionedTypes.toString() !== checkInfo.beforeTypes)
						clogger(escapeHTML(`Expected ${checkInfo.beforeTypes} but got ${unionedTypes.toString()}`));
				}
			});
		}
		const tokenTypesMap = analyzeTokenDataTypes(cachedParseTree, basicTokenValuesMap, variables);
		adjustSubtypesForLists(cachedParseTree, variables, tokenTypesMap);
		if (caseInfo.checks !== undefined) {
			caseInfo.checks.forEach(function(checkInfo, cIndex) {
				const clogger = prefixWrapper(`Check ${cIndex}`, plogger);
				const variable = variables.getVariableByName(checkInfo.varName);
				if (variable === undefined)
					clogger(`Expected to get a variable named ${checkInfo.varName} but not found`);
				else if (variable.scopes.length === 0)
					clogger(`Expected to have some scopes but none found for variable ${checkInfo.varName}`);
				else {
					const unionedTypes = unionAssignedTypes(variable);
					if (unionedTypes.toString() !== checkInfo.types)
						clogger(escapeHTML(`Expected types ${checkInfo.types} but got "${unionedTypes.toString()}"`));
				}
			});
		}
	});
};