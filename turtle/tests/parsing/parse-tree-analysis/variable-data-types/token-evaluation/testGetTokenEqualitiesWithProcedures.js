import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithProcedures(logger) {
	const cases = [
		{'code': `to p
	localmake "x 2
	print :x
end`,
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
			},
			]
		},
		{'code': `to p :y
	make "y 3 ; set parameter's value to 3.  
	; Ignore the value passed in by argument/parameter.
	print :y
end`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': 3
				},
				'toTokens': [
					{'val': 'y',
					'hasParentVal': 'print'
					}
				]
			},
			]
		},
		{'code': `make "x 123
to p
	print :x
end`,
		'numEqualKeys': 1,
		'checks': [
			{
				'fromToken': {
					'val': 123
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			},
			]
		},
		{'code': `to p :x
	print :x
end

p 100`,
			'numEqualKeys': 1,
			'checks': [
				{
					'fromToken': {
						'val': 100
					},
					'toTokens': [
						{'val': 'x',
						'hasParentVal': 'print'
						}
					]
				},
			]
		},
		{'code': `to p
	if randomRatio < 0.5 [
		output 6
	]
	output 3
end

print p`,
			'numEqualKeys': 0,
			// the value of p could be 3 or 6.
			// We can't connect 1 single token only to the call to procedure p.
			'checks': []
		},
		{'code': `to p
	output 3
end

print p`,
			'numEqualKeys': 1,
			'checks': [
				{
					'fromToken': {
						'val': 3
					},
					'toTokens': [
						{'val': 'p',
						'hasParentVal': 'print'
						}
					]
				},
			]
		}
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};