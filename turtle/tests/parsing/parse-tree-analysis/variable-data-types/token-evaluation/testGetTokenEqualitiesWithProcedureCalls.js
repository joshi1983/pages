import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithProcedureCalls(logger) {
	const cases = [
		/*{'code': `to p
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
		},*/
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
		}
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};