import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
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
		{'code': `make "penSizeRatios []
queue2 "penSizeRatios 4
print :penSizeRatios

to drawTree
	print item 1 :penSizeRatios 
end`,
			'numEqualKeys': 0,
			'checks': []
		},
		{'code': `to p
	localmake "colorIndex 1
	for ["col 1 3] [
		localmake "colorIndex :colorIndex + 1
		if :colorIndex > 3 [
			stop
		]
	]
end`,
			'numEqualKeys': 1,
			'checks': [
				{
					'fromToken': {
						'val': '+',
						'hasParentVal': 'localmake'
					},
					'toTokens': [
						{
							'val': 'colorIndex',
							'type': ParseTreeTokenType.VARIABLE_READ,
							'hasParentVal': '>'
						}
					]
				}
			]
		}
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};