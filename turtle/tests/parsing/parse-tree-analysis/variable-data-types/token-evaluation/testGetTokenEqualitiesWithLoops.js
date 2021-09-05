import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithLoops(logger) {
	const cases = [
		{'code': `make "x 2
repeat :x [
	print :x
]`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': 2
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'repeat'
					},
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `make "x 2
repeat :x [
	print :x
	make "x :x + 1
	print :X
]`,
		'numEqualKeys': 2,
		'checks': [
			{
				'fromToken': {
					'val': 2
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'repeat'
					}
				]
			},
			{
				'fromToken': {
					'val': '+'
				},
				'toTokens': [
					{'val': 'X',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `make "x 2
for ["i 1 :x] [
	print "hi
]`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': 2
				},
				'toTokens': [
					{'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ
					}
				]
			}
		]},
		{'code': `make "i 1
while :i < 3 [
	print :i
	make "i :i + 1
]`,
		'numEqualKeys': 0,
		// None of the :i tokens are exclusively reading 1 or 
		// from the (:i + 1) operator token.
		// The :i in :i < 3 reads 1,2,3.
		// The :i in print :i reads 1,2.
		// The :i in make "i :i + 1 also reads 1,2.
		'checks': []
		},
		{'code': `make "y 123
make "i 1
while :i < 3 [
	print :y
	make "i :i + 1
]`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': 123
				},
				'toTokens': [
					{'val': 'y',
					'type': ParseTreeTokenType.VARIABLE_READ
					}
				]
			}
		]
		}
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};