import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { shouldScopeBeReduced } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/shouldScopeBeReduced.js';

export function testShouldScopeBeReduced(logger) {
	const cases = [
		{'code': 'make "x 5\nprint :x', 
			'varName': 'x',
			'fromToken': {
				'val': 'print'
			},
			'newToToken': {
				'type': ParseTreeTokenType.VARIABLE_READ
			},
			'result': true
		},
		{'code': 'if 1 < random 2 [make "x 5\nprint :x]', 
			'varName': 'x',
			'fromToken': {
				'val': 'print'
			},
			'newToToken': {
				'type': ParseTreeTokenType.VARIABLE_READ
			},
			'result': true
		},
		{'code': 'if 1 < random 2 [make "x 5\nprint :x]\nif 1 > random 2 [Make "x 10]',
			'varName': 'x',
			'fromToken': {
				'val': 'print'
			},
			'newToToken': {
				'val': 'Make'
			},
			'result': false
			/*
			Make "x 10 might not execute when the assignment happens
			and therefore shouldn't reduce the scope for the make "x 5.
			*/
		},
		{'code': `ifelse true [
	make "x 1
	print :X
] [
	make "x 2
]
Print :x`,
			'varName': 'x',
			'fromToken': {
				'val': 'print'
			},
			'newToToken': {
				'val': 2
			},
			'result': false
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const allTokens = tree.getAllTokens();
		const variables = tree.getVariables();
		const variable = variables.getVariableByName(caseInfo.varName);
		const fromToken = findToken(caseInfo.fromToken, allTokens, plogger);
		const newToToken = findToken(caseInfo.newToToken, allTokens, plogger);
		const matchingScopes = variable.scopes.filter(scope => scope.fromToken === fromToken);
		if (matchingScopes.length !== 1)
			plogger(`Expected 1 matching scope but found ${matchingScopes.length}`);
		else {
			const scope = matchingScopes[0];
			const actualResult = shouldScopeBeReduced(tree, scope, newToToken);
			if (actualResult !== caseInfo.result)
				plogger(`Expected result to be ${caseInfo.result} but got ${actualResult}`);
		}
	});
};