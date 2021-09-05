import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithVariableMutations(logger) {
	const cases = [
		{'code': `make "x []
queue "x 4`,
		'numEqualKeys': 0,
		// There are no :x which usually means no equal tokens to be evaluated.
		'checks': []
		},
		{
			'code': `make "x [[]]
make "y first :x
queue2 "y 23 ; The value from :x of [[]] would become [[23]].
print :x`,
			'numEqualKeys': 2,
			'checks': [
				{
					'fromToken': {
						'type': ParseTreeTokenType.LIST,
						'hasParentVal': 'make'
					},
					'numToTokens': 1,
					'toTokens': [
						{'val': 'x',
						'hasParentVal': 'first'
						}
					]
				},
				{
					'fromToken': {
						'type': ParseTreeTokenType.LIST,
						'hasParentType': ParseTreeTokenType.LIST
					},
					'toTokens': [
						{
						'val': 'first'
						}
					]
				},
			]
		},
		{
			'code': `make "x [[]]
make "y last :x
queue2 "y 23 ; The value from :x of [[]] would become [[23]].
print :x`,
			'numEqualKeys': 2,
			'checks': [
				{
					'fromToken': {
						'type': ParseTreeTokenType.LIST,
						'hasParentVal': 'make'
					},
					'numToTokens': 1,
					'toTokens': [
						{'val': 'x',
						'hasParentVal': 'last'
						}
					]
				},
				{
					'fromToken': {
						'type': ParseTreeTokenType.LIST,
						'hasParentType': ParseTreeTokenType.LIST
					},
					'toTokens': [
						{
						'val': 'last'
						}
					]
				},
			]
		},
		{'code': `make "x []
queue2 "x 4`,
		'numEqualKeys': 0,
		'checks': []
		},
		{'code': `make "x []
queue2 "x 3
print :x`,
		'numEqualKeys': 0,
		// The :x does not refer to [] because the queue2 mutated the list.
		'checks': []
		},
		{'code': `make "x [1 2 3]
print dequeue2 "x
print :x`,
		'numEqualKeys': 0,
		'checks': []
		},
		{'code': `make "x [1 2 3]
print dequeue "x
print :x`,
		'numEqualKeys': 0,
		'checks': []
		},
		{'code': `make "x []
setItem 1 "x 3
print :x`,
		'numEqualKeys': 0,
		// The setItem mutates the list so the :x token does not refer to the empty list
		// represented by [].
		'checks': []
		},
		{'code': `make "x [1 2 3 4]
removeLast "x
print :x`,
		'numEqualKeys': 0,
		// The removeLast "x
		'checks': []
		},
		{'code': `make "x []
print rput 3 :x`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'type': ParseTreeTokenType.LIST,
					'hasParentVal': 'make'
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'rput'
					}
				]
			},
		]
		},
		{'code': `make "x 3
make "x 4
print :x`,
		'numEqualKeys': 1,
		// No other token equals 3.
		// The value gets replaced in variable x before it ever gets read.
		'checks': [
			{
				'fromToken': {
					'val': 4
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			},
			]
		},
		{'code': `make "x []
make "y :x
queue2 "y 3
print :x`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'type': ParseTreeTokenType.LIST,
					'hasParentVal': 'make'
				},
				'numToTokens': 1,
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'make',
					'type': ParseTreeTokenType.VARIABLE_READ
					}
				]
			},
		]
		},
		{'code': `make "x []
queue "x 3
print :x`,
		'numEqualKeys': 0,
		'checks': []
		},
		{'code': `make "x []
make "y :x
queue "x 3 ; x = [3] but y = [].  
; This is because queue creates a new clone of the list.
; That is the main difference between queue and queue2.
print :y`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'type': ParseTreeTokenType.LIST,
					'hasParentVal': 'make'
				},
				'toTokens': [
					{
						'val': 'x',
						'type': ParseTreeTokenType.VARIABLE_READ,
						'hasParentVal': 'make'
					},
					{
						'val': 'y',
						'hasParentVal': 'print'
					}
				]
			}
		]
		},
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};