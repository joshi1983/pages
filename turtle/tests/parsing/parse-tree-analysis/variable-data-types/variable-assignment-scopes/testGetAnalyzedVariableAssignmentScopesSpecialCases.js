import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { processVariableAssignmentScopeTestCase } from '../processVariableAssignmentScopeTestCase.js';

export function testGetAnalyzedVariableAssignmentScopesSpecialCases(logger) {
	const cases = [{
		'code': 'to p :x\n repeat 4 [\n fd :x\n  right 90\n localmake "x 10]\n end',
		'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{
						'fromToken': {
							'val': null,
							'type': ParseTreeTokenType.LIST,
							'hasChildVal': 'repeat',
							'hasParentType': ParseTreeTokenType.PROCEDURE_START_KEYWORD
						},
						'toToken': {
							'val': 10
						}
					},
					{
						'fromToken': {
							'val': 'fd',
							'type': ParseTreeTokenType.PARAMETERIZED_GROUP
						},
						'toToken': {
							'val': 'end'
						}
					}
				]
			}
		]
	}, {
		'code': 'MAKE "i 0\nUNTIL :i>3 [Make "i :i+1 PRINT :i]',
		'scopeChecks': [
			{
				'varName': 'i',
				'scopes': [
					{
						'assignedTypes': 'int',
						'fromToken': {
							'val': 'UNTIL'
						},
						'toToken': {
							'val': 1
						}
					},
					{
						'fromToken': {
							'val': 'Make',
							'type': ParseTreeTokenType.PARAMETERIZED_GROUP
						},
						'toToken': {
							'val': ']',
							'type': ParseTreeTokenType.LEAF
						}
					}
				]
			}
		]
	}, {
		'code': `repeat 2 [
	MAke "radius 100
	maKE "radiusDelta 15
	repeaT 4 [
		if repcount <> 3 [
			Make "radiusDelta 16
		]
	]
	mAke "radiusDelta :radiusDelta - 17
	maKe "radius :radius - :radiusDelta
	Repeat 6 [
		makE "radius :radius - :radiusDelta
		MAKE "radiusDelta :radiusDelta - 18
	]
]`,
		'scopeChecks': [
			{
				'varName': 'radiusdelta',
				'scopes': [
					{
						'assignedTypes': 'int',
						'assignTokenVal': 'maKE',
					},
					{
						'assignTokenVal': 'Make',
					},
					{
						'assignTokenVal': 'mAke',
					},
					{
						'assignTokenVal': 'MAKE',
					}
				]
			}
		]
	},
	{
		'code': 'maKE "x 5 make "X 10',
		'scopeChecks': [{
			'varName': 'x',
			'scopes': [
				{
					'assignedTypes': 'int',
					'assignTokenVal': 'maKE',
					'fromToken': {
						'val': 'make'
					},
					'toToken': {
						'val': 'X'
					}
				},
				{
					'assignedTypes': 'int',
					'assignTokenVal': 'make',
					'toToken': {
						'val': 10
					}
				}
			]
		}
		]
	}, {
		'code': `to drawFlag
	repeat 9 [
		ifelse 1 = repcount [
			localMaKE "x 5
		] [
			localmake "X 6
		]
		forward :x
	]
end`,
		'scopeChecks': [{
			'varName': 'x',
			'scopes': [
				{
					'assignedTypes': 'int',
					'assignTokenVal': 'localMaKE',
					'fromToken': {
						'val': 'ifelse'
					},
					'toToken': {
						'val': 'end'
					}
				},
				{
					'assignedTypes': 'int',
					'assignTokenVal': 'localmake',
				}
			]
		}
		]
	}, {
		'code': 'to p :x\nif :x > 4 [fd :x localmake "x "hello label :x]\nend',
		'scopeChecks': [{
			'varName': 'x',
			'scopes': [
				{
					'isParameter': true,
					'fromToken': {
						'val': null,
						'hasChildVal': 'if'
					},
					'toToken': {
						'val': 'end'
					}
				},
				{
					'assignedTypes': 'string',
					'assignTokenVal': 'localmake',
					'fromToken': {
						'val': 'label'
					},
					'toToken': {
						'val': 'end'
					}
				}
			]
		}
		]
	}, {
		'code': 'to p :x\nfd :x\nend\nTo q :x\nfd :x\nEnd',
		'scopeChecks': [{
			'varName': 'x',
			'scopes': [
				{
					'isParameter': true,
					'toToken': {
						'val': 'end'
					}
				},
				{
					'isParameter': true,
					'toToken': {
						'val': 'End'
					}
				}
			]
		}
		]
	}, {
		'code': 'to p\nmake "x 5\nEnd\nto p2\np\neNd\nprint :X',
		'scopeChecks': [{
			'varName': 'x',
			'scopes': [
				{
					'isParameter': false,
					'fromToken': {
						'val': 'X'
					},
					'toToken': {
						'val': 'X'
					}
				}
			]
		}
	]
	}, {
		'code': 'to p\nmake "x 5\nend\np\nprint :X',
		'scopeChecks': [{
			'varName': 'x',
			'scopes': [
				{
					'isParameter': false,
					'assignTokenVal': 'make',
					'toToken': {
						'val': 'X'
					}
				}
			]
		}
		]
	}, {
		'code': 'to p\nmake "x 5\nrepeat 2[\nMake "x :X + 1\n]\nend',
		'scopeChecks': [
		{
			'varName': 'x',
			'scopes': [
				{
					'isParameter': false,
					'assignTokenVal': 'make',
					'fromToken': {
						'val': 'repeat'
					}
				},
				{
					'isParameter': false,
					'assignTokenVal': 'Make',
					'fromToken': {
						'val': 'Make'
					},
					'toToken': {
						'val': 'end'
					}
				}
			]
		}
		]
	}];
	cases.forEach(function(caseInfo, index) {
		processVariableAssignmentScopeTestCase(caseInfo, index, logger);
	});
};