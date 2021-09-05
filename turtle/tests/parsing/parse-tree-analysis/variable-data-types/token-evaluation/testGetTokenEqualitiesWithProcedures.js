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
		}
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};