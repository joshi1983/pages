import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getLastSingleValueTokenForControlStructure } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getLastSingleValueTokenForControlStructure.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function findScope(variables, scopeInfo, tokens, logger) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function. Insted, typeof logger is ${typeof logger}`);
	let scopes = variables.getAllScopesAsArray();
	if (scopeInfo.assignToken !== undefined) {
		const assignToken = findToken(scopeInfo.assignToken, tokens, logger);
		scopes = scopes.filter(scope => scope.assignToken === assignToken);
	}
	if (scopes.length !== 1) {
		logger(`Expected 1 scope but got ${scopes.length}`);
		return undefined;
	}
	return scopes[0];
}

export function testGetLastSingleValueTokenForControlStructure(logger) {
	const cases = [{
		'code': 'make "x 5\nprint :x\nwhile :x < 10 [Make "x :x + 1]\npRint :x',
		'checks': [
			{
				'scope': {
					'assignToken': {
						'val': 'make'
					}
				},
				'singleValue': 5,
				'subchecks': [
					{
						'inToken': {
							'val': 'print'
						},
						'resultToken': {
							'val': 'print'
						}
					},
					{
						'inToken': {
							'val': 'Make'
						},
						'resultToken': {
							'val': 'while'
						}
					},
					{
						'inToken': {
							'val': 'while'
						},
						'resultToken': {
							'val': 'while'
						}
					}
				]
			}
		]
	},{
		'code': 'make "x 5\nprint :x\nif :x < 10 [Make "x :x + 1]\npRint :x',
		'checks': [
			{
				'scope': {
					'assignToken': {
						'val': 'make'
					}
				},
				'singleValue': 5,
				'subchecks': [
					{
						'inToken': {
							'val': 'Make'
						},
						'resultToken': {
							'val': 'Make'
						}
					},
				]
			}
		]
	},{
		'code': 'make "x 5\nprint :x\nifelse :x < 10 [Make "x :x + 1] []\npRint :x',
		'checks': [
			{
				'scope': {
					'assignToken': {
						'val': 'make'
					}
				},
				'singleValue': 5,
				'subchecks': [
					{
						'inToken': {
							'val': 'Make'
						},
						'resultToken': {
							'val': 'Make'
						}
					},
				]
			}
		]
	},{
		'code': 'make "x 5\nfor ["y 6 1] [Make "x :x + 1]\npRint :x',
		'checks': [
			{
				'scope': {
					'assignToken': {
						'val': 'make'
					}
				},
				'singleValue': 5,
				'subchecks': [
					{
						'inToken': {
							'val': 'Make'
						},
						'resultToken': {
							'val': null,
							'type': ParseTreeTokenType.LIST,
							'hasParentVal': 'for',
							'hasChildVal': 'Make'
						}
					},
				]
			}
		]
	},{
		'code': 'make "x 0 while :X < 3 [fd 10 Make "x :x + 1]',
		'checks': [
		{
			'scope': {
				'assignToken': {
					'val': 'make'
				}
			},
			'singleValue': 0,
			'subchecks': [
				{
					'inToken': {
						'val': 'Make'
					},
					'resultToken': {
						'val': 'while'
					}
				},
			]
		}
		]
	},{
		'code': `to p :size
	while :size > 0.5 [
		localmake "size :size * 0.98
	]
end

p 100`,
		'checks': [
		{
			'scope': {
				'assignToken': {
					'type': ParseTreeTokenType.LIST,
					'hasChildVal': 'while'
				}
			},
			'singleValue': 100,
			'subchecks': [
			{
					'inToken': {
						'val': 'localmake'
					},
					'resultToken': {
						'val': 'while'
					}
				}
			]
		}
		]
	}, {
		'code': 'make "x []\nqueue "x 5\nprint :x',
		'checks': [{
			'scope': {
				'assignToken': {
					'val': 'make'
			}
			},
			'subchecks': []
		}
		]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code = ${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const variables = tree.getVariables();
		const tokens = tree.getAllTokens();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const checkLogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const scope = findScope(variables, checkInfo.scope, tokens, checkLogger);
			if (scope !== undefined) {
				const variable = scope.variable;
				const procedure = tree.getProcedureByName(scope.assignToken);
				if (!DeepEquality.equals(scope.singleValue, checkInfo.singleValue))
					checkLogger(`Expected singleValue to be ${JSON.stringify(checkInfo.singleValue)} but got ${JSON.stringify(scope.singleValue)}`);
				checkInfo.subchecks.forEach(function(subcheckInfo, subcheckIndex) {
					const scheckLogger = prefixWrapper(`Subcheck ${subcheckIndex}`, checkLogger);
					const inToken = findToken(subcheckInfo.inToken, tokens, scheckLogger);
					const resultToken = findToken(subcheckInfo.resultToken, tokens, scheckLogger);
					const result = getLastSingleValueTokenForControlStructure(tree, variable, scope, procedure, inToken);
					if (resultToken !== result)
						scheckLogger(`Expected ${resultToken.toString()} but got ${result.toString()}`);
				});
			}
		});
	});
};