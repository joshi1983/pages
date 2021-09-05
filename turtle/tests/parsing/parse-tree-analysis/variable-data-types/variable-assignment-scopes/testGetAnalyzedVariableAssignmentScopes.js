import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { processVariableAssignmentScopeTestCase } from '../processVariableAssignmentScopeTestCase.js';

function testGeneralCases(logger) {
	const cases = [
		{
			'code': 'to p\nmake "x 5\nend\nprint :x', 'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{
						'singleValue': 5,
						'toToken': {
							'val': 'end'
						}
					}
				]
			}
		]},
		{
			'code': 'to p\nmake "x 5\nend\np\nprint :x', 'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{
						'singleValue': 5,
						'toToken': {
							'val': 'x',
							'type': ParseTreeTokenType.VARIABLE_READ
						}
					}
				]
			}
		]},
		{'code': 'to p\nfd 100\nmake "x 5\nfd :x\nend', 'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{
						'toToken': {
							'val': 'end'
						}
					}
				]
			}
		]},
		{'code': 'to p\nfd 100\nlocalmake "x 5\nfd :x\nend', 'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{
						'fromToken': {
							'val': 'fd',
							'hasChildVal': 'x'
						},
						'toToken': {
							'val': 'end'
						}
					}
				]
			}
		]},
		{'code': 'make "x 300\nto p\nend\nfd :x', 'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{'toToken': {
							'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
						}
					}
				]
			}
		]},
		{'code': 'make "x 300\nfd :x', 'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{
						'fromToken': {
							'val': 'fd'
						},
						'toToken': {
							'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
						}
					}
				]
			}
		]},
		{'code': 'for ["x 0 5] [ print "hi]\nfd :x', 'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{
						'fromToken': {
							'val': null,
							'hasParentVal': 'for',
							'hasChildVal': 'print',
							'type': ParseTreeTokenType.LIST
						},
						'toToken': {
							'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
						}
					}
				]
			}
		]},
		{'code': 'make "x createPList\nprint "hi\nprint :x', 'scopeChecks': [
			{
				'varName': 'x',
				'scopes': [
					{
						'singleValue': new Map(),
						'fromToken': {
							'val': 'print',
							'hasChildVal': 'hi'
						},
						'toToken': {
							'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
						}
					}
				]
			}
		]},
		{
			'code': 'make "x 4\nMake "x 5\nprint :x',
			'scopeChecks': [
				{
					'varName': 'x',
					'scopes': [
						{
							'singleValue': 4,
							'fromToken': {
								'val': 'Make'
							},
							'toToken': {
								'val': 5
							}
						},
						{
							'singleValue': 5,
							'fromToken': {
								'val': 'print'
							},
							'toToken': {
								'val': 'x',
								'type': ParseTreeTokenType.VARIABLE_READ
							}
						}
					]
				}
			]
		},
		{
			'code': 'to p\nprint :x\nend\nmake "x "hello\np',
			'scopeChecks': [
				{
					'varName': 'x',
					'scopes': [
						{
							'fromToken': {
								'val': 'p',
								'type': ParseTreeTokenType.PARAMETERIZED_GROUP
							},
							'toToken': {
								'val': 'p',
								'type': ParseTreeTokenType.PARAMETERIZED_GROUP
							}
						}
					]
				}
			]
		},
		{
			'code': 'to p\nprint :x\nend\nmake "x "hello\nP\nMake "x 5\np',
			'scopeChecks': [
				{
					'varName': 'x',
					'scopes': [
						{
							'fromToken': {
								'val': 'P',
								'type': ParseTreeTokenType.PARAMETERIZED_GROUP
							},
							'toToken': {
								'val': 5
							}
						},
						{
							'fromToken': {
								'val': 'p',
								'type': ParseTreeTokenType.PARAMETERIZED_GROUP
							},
							'toToken': {
								'val': 'p',
								'type': ParseTreeTokenType.PARAMETERIZED_GROUP
							}
						}
					]
				}
			]
		},
		{'code': `to addElement :mylist
		queue2 "mylist 5
		end
		make "mylist1 []
		addElement :mylist1
		print item 1 :mylist1`,
		'scopeChecks': [
				{
					'varName': 'mylist1',
					'scopes': [
						{
							/*
							singleValue should be undefined because the queue2 adds an element to the list.
							That changes the value so the scope should be associated with more than 1 single value.
							*/
							'singleValueUndefined': true,
							'fromToken': {
								'val': 'addElement',
								'type': ParseTreeTokenType.PARAMETERIZED_GROUP
							},
							'toToken': {
								'val': 'mylist1',
								'hasParentVal': 'item'
							}
						}
					]
				}
			]
		},

	];
	cases.forEach(function(caseInfo, index) {
		processVariableAssignmentScopeTestCase(caseInfo, index, logger);
	});
}

export function testGetAnalyzedVariableAssignmentScopes(logger) {
	testGeneralCases(prefixWrapper('testGeneralCases', logger));
};