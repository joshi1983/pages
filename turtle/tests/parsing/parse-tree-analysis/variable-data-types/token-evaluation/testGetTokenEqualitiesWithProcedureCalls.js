import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithProcedureCalls(logger) {
	const cases = [
		{'code': `to p
	if randomRatio < 0.5 [
		make "x 4
	]
end

make "x 3
p
print :x`,
		'numEqualKeys': 0,
		// Is :x equal to the 3 or 4 tokens?  We don't know.
		'checks': []
		},
		{'code': `to p
end

make "x 3
p
print :x`,
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
			},
		]
		},
		{'code': `to p :y
	localmake "x :y
	queue2 "x 4
end

make "z []
p :z
print :z`,
		'numEqualKeys': 2,
		'checks': [
			{
				'fromToken': {
					'type': ParseTreeTokenType.LIST,
					'hasParentVal': 'make'
					// The [] assigned to global variable z.
				},
				'toTokens': [
					{
						'val': 'z',
						'type': ParseTreeTokenType.VARIABLE_READ,
						'hasParentVal': 'p'
					},
				]
			},
			{
				'fromToken': {
					'type': ParseTreeTokenType.VARIABLE_READ,
					'val': 'z',
					'hasParentVal': 'p'
					// the :z in to p :z
				},
				'toTokens': [
					{
						'val': 'y',
						'type': ParseTreeTokenType.VARIABLE_READ,
						'hasParentVal': 'localmake'
						// the read of parameter y in procedure p
					},
				]
			},
			]
		},
		{
			'code': `to p :x
	queue2 "x 5
end

make "someNumber 3
make "z []
p :z
print :someNumber`,
		'numKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': 3,
					'hasParentVal': 'make'
				},
				'toTokens': [
					{
						'val': 'someNumber',
						'type': ParseTreeTokenType.VARIABLE_READ
					}
				]
			},
		]
		},
		{
			'code': `to p :x
	if number? :x [
		print :x + 1
	]
end

p "red`,
			'numEqualKeys': 1,
			'checks': [
				{
					'fromToken': {
						'val': 'red',
						'type': ParseTreeTokenType.STRING_LITERAL,
						'hasParentVal': 'p'
					},
					'numToTokens': 1,
					'toTokens': [
						{
							'val': 'x',
							'type': ParseTreeTokenType.VARIABLE_READ,
							'hasParentVal': 'number?'
						}
					]
				},
			]
		},
		{
			'code': `to addElement :mylist
	queue2 "mylist 5
end

to p1
	localmake "mylist1 []
	addElement :mylist1
	print item 1 :mylist1
end

p1`,
			'numEqualKeys': 1,
			'checks': [
				{
					'fromToken': {
						'type': ParseTreeTokenType.LIST,
						'hasParentVal': 'localmake'
						// The [] in localmake "mylist1 []
					},
					'numToTokens': 1,
					'toTokens': [
						{
							'val': 'mylist1',
							'type': ParseTreeTokenType.VARIABLE_READ,
							'hasParentVal': 'addElement'
							// :mylist1 from addElement :mylist1
						}
					]
				}
			]
		}
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};