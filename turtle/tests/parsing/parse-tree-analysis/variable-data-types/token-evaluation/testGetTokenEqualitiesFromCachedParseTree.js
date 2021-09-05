import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesFromCachedParseTree(logger) {
	const cases = [
		{'code': `make "x 2
print :x`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': 2
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `make "x 1
make "x 2 + :x
make "y 12
print :x
print :y`,
		'numEqualKeys': 3,
		'checks': [
			{
				'fromToken': {
					'val': 1
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': '+'
					}
				]
			},
			{
				'fromToken': {
					'val': '+'
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			},
			{
				'fromToken': {
					'val': 12
				},
				'toTokens': [
					{'val': 'y',
					'hasParentVal': 'print'
					}
				]
			}
		]},
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};