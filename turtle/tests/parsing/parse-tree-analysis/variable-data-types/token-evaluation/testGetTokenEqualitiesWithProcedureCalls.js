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
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};