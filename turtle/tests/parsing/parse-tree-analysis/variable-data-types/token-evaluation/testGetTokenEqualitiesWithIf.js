import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithIf(logger) {
	const cases = [
		{'code': `make "x 2
if randomRatio < 0.5 [
	make "x 3
]
print :x ; is this 2 or 3? It could be either.`,
		'numEqualKeys': 0,
		'checks': []},
		{'code': `make "x true
if :x []`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': true
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'if'
					}
				]
			}
		]},
		{'code': `make "x true
if :x [
	print :x
]`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': true
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'if'
					},
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `
if randomRatio < 0.5 [
	make "x 3
	print :x
]`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': 3
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			}
		]},
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};