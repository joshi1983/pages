import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithIfElse(logger) {
	const cases = [
		{'code': `ifelse randomRatio < 0.5 [
	make "x 3
] [
	make "x 4
]
print :x ; is this 3 or 4? It could be either.`,
		'numEqualKeys': 0,
		'checks': []},
		{'code': `make "x true
ifelse :x [] []
print :x`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': true
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'ifelse'
					},
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `make "x 3
ifelse randomRatio < 0.5 [
	print :x
] [
	print :X
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
					},
					{'val': 'X',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `make "x 3
ifelse randomRatio < 0.5 [
	make "x 4
	print :x
] [
	print :X
]`,
		'numEqualKeys': 2,
		'checks': [
			{
				'fromToken': {
					'val': 3
				},
				'toTokens': [
					{'val': 'X',
					'hasParentVal': 'print'
					}
				]
			},
			{
				'fromToken': {
					'val': 4
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