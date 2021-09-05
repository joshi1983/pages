import { processGetTokenEqualitiesFromCachedParseTreeCases } from
'./processGetTokenEqualitiesFromCachedParseTreeCases.js';

export function testGetTokenEqualitiesWithSwap(logger) {
	const cases = [
		{'code': `swap "x "y
print :x
print :y`,
		'numEqualKeys': 0,
		'checks': []},
		{'code': `make "x 2
make "y 10
swap "x "y
print :x
print :y`,
		'numEqualKeys': 2,
		'checks': [
			{
				'fromToken': {
					'val': 2
				},
				'toTokens': [
					{'val': 'y',
					'hasParentVal': 'print'
					}
				]
			},
			{
				'fromToken': {
					'val': 10
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `to p
make "x 2
make "y 10
swap "x "y
print :x
print :y
end`,
		'numEqualKeys': 2,
		'checks': [
			{
				'fromToken': {
					'val': 2
				},
				'toTokens': [
					{'val': 'y',
					'hasParentVal': 'print'
					}
				]
			},
			{
				'fromToken': {
					'val': 10
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `to p
make "x 2 ; x is a global variable.
localmake "y 10 ; a locally scoped variable
swap "x "y
print :x
; x should still be a global variable but bound to the value of the 10 token.
print :y
end`,
		'numEqualKeys': 2,
		'checks': [
			{
				'fromToken': {
					'val': 2
				},
				'toTokens': [
					{'val': 'y',
					'hasParentVal': 'print'
					}
				]
			},
			{
				'fromToken': {
					'val': 10
				},
				'toTokens': [
					{'val': 'x',
					'hasParentVal': 'print'
					}
				]
			}
		]},
		{'code': `to p
localmake "x 2
localmake "y 10
swap "x "y
print :x
print :y
end`,
		'numEqualKeys': 2,
		'checks': [
			{
				'fromToken': {
					'val': 2
				},
				'toTokens': [
					{'val': 'y',
					'hasParentVal': 'print'
					}
				]
			},
			{
				'fromToken': {
					'val': 10
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