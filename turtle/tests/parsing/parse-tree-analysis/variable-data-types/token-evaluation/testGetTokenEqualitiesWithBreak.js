import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithBreak(logger) {
	const cases = [
		{'code': `break`,
		'numEqualKeys': 0,
		'checks': []},
		{'code': `forever [
	make "x 3
	break
]
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
			}
		]},
		{'code': `forever [
	make "x 3
	break
	make "x 4 ; never executes because of break.
]
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
			}
		]},
	];
	processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger);
};