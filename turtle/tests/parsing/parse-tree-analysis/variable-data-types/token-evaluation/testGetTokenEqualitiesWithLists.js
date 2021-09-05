import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithLists(logger) {
	const cases = [
		{'code': `make "x [1 2]
queue2 "x 123
print :x`,
		'numEqualKeys': 0,
		// The queue2 mutates :x so the :x is not equal to [1 2].
		'checks': []
		},
		{'code': `make "x [1 2]
queue "x 123
print :x`,
		'numEqualKeys': 0,
		'checks': []
		},
		{'code': `make "x [1 2]
setItem 1 "x 123
print :x`,
		'numEqualKeys': 0,
		'checks': []
		},
		{'code': `make "x [1 2]
removeLast "x
print :x`,
		'numEqualKeys': 0,
		'checks': []
		},
		{'code': `make "x [1 2]
	print first :x
	print item 1 :x
	print ITEM 2 :X
	print last :x
	print LAST :X`,
		'numEqualKeys': 3,
		'checks': [
			{
				'fromToken': {
					'val': null,
					'type': ParseTreeTokenType.LIST
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'first'
					}
				]
			},
			{
				'fromToken': {
					'val': 1,
					'hasParentType': ParseTreeTokenType.LIST
				},
				'toTokens': [
					{'val': 'first'
					},
					{'val': 'item'
					}
				]
			},
			{
				'fromToken': {
					'val': 2,
					'hasParentType': ParseTreeTokenType.LIST
				},
				'toTokens': [
					{'val': 'ITEM'
					},
					{'val': 'last'
					},
					{'val': 'LAST'
					}
				]
			},
			]
		},
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};