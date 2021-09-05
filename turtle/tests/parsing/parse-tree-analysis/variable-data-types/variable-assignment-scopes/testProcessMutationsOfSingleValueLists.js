import { DeepEquality } from
'../../../../../modules/DeepEquality.js';
import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { processMutationsOfSingleValueLists } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/processMutationsOfSingleValueLists.js';

function findScope(variables, scopeInfo, logger) {
	const variable = variables.getVariableByName(scopeInfo.varName);
	if (variable === undefined)
		logger(`Expected to find variable named ${scopeInfo.varName} but did not`);
	if (scopeInfo.scopeIndex >= variable.scopes.length || scopeInfo.scopeIndex < 0)
		logger(`Expected scopeIndex to be in 0..${variable.scopes.length - 1} but got ${scopeInfo.scopeIndex}`);
	return variable.scopes[scopeInfo.scopeIndex];
}

export function testProcessMutationsOfSingleValueLists(logger) {
	const cases = [
	{'code': 'make "x []', 'numScopes': 1, 'scopeChecks': [
		{
			'varName': 'x',
			'scopeIndex': 0,
			'singleValue': []
		}
	]},
	{'code': 'make "x []\nqueue2 "x 5', 'numScopes': 1, 'scopeChecks': [
		{
			'varName': 'x',
			'scopeIndex': 0,
			'singleValueAssignedBefore': [],
			'singleValue': undefined
		}
	]},
	{'code': 'make "x []\nqueue "x 5', 'numScopes': 1, 'scopeChecks': [
		{
			'varName': 'x',
			'scopeIndex': 0,
			'singleValue': undefined
		}
	]},
	{'code': 'make "x []\nsetItem 1 "x 5', 'numScopes': 1, 'scopeChecks': [
		{
			'varName': 'x',
			'scopeIndex': 0,
			'singleValue': undefined
		}
	]},
	{'code': 'to p :y\nqueue2 "y 4\nend\nmake "x []\np :x\nprint :x', 
	'numScopes': 2, 'scopeChecks': [
		{
			'varName': 'x',
			'scopeIndex': 0,
			'singleValueAssignedBefore': [],
			'singleValue': undefined
		},
		{
			'varName': 'y',
			'scopeIndex': 0,
			'singleValue': undefined
		}
	]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const variables = cachedParseTree.getVariables();
		
		// process singleValueAssignedBefore.
		// This is to mock the state of variables before processMutationsOfSingleValueLists runs.
		// Since getVariables() indirectly calls processMutationsOfSingleValueLists,
		// calling it again here won't have much effect unless we mutate singleValue before calling it.
		caseInfo.scopeChecks.forEach(function(scopeInfo) {
			const scope = findScope(variables, scopeInfo, logger);
			if (scopeInfo.singleValueAssignedBefore !== undefined) {
				scope.singleValue = scopeInfo.singleValueAssignedBefore;
			}
		});

		processMutationsOfSingleValueLists(cachedParseTree, variables);
		if (caseInfo.numScopes !== undefined) {
			const scopes = variables.getAllScopesAsArray();
			if (scopes.length !== caseInfo.numScopes)
				plogger(`Expected number of scopes to be ${caseInfo.numScopes} but found ${scopes.length}`);
		}
		caseInfo.scopeChecks.forEach(function(scopeInfo, scopeIndex) {
			const slogger = prefixWrapper(`Scope check ${scopeIndex}`, plogger);
			const scope = findScope(variables, scopeInfo, slogger);
			if (scopeInfo.singleValue !== undefined) {
				if (!DeepEquality.equals(scope.singleValue, scopeInfo.singleValue))
					slogger(`Expected ${scopeInfo.singleValue} but got ${scope.singleValue}`);
			}
			else if (scope.singleValue !== undefined) {
				slogger(`Expected undefined but got ${scope.singleValue}`);
			}
		});
	});
};