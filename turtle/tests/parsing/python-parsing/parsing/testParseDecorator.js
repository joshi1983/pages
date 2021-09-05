import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseDecorator(logger) {
	const cases = [
	{
		'code': '@decorator1',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': '@decorator1',
				'type': ParseTreeTokenType.DECORATOR,
				'children': []
			}]
		}
	},
	{
		'code': '@decorator1\n@decorator2',
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': '@decorator1',
				'type': ParseTreeTokenType.DECORATOR,
				'children': []
			},{
				'val': '@decorator2',
				'type': ParseTreeTokenType.DECORATOR,
				'children': []
			}]
		}
	},
	{
		'code': '@decorator1(3)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [{
				'val': '@decorator1',
				'type': ParseTreeTokenType.DECORATOR,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': '3', 'children': []},
						{'val': ')', 'children': []}
					]}
				]
			}]
		}
	},
	{
		'code': '@decorator1(3)\n@decorator2',
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'val': '@decorator1',
					'type': ParseTreeTokenType.DECORATOR,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': '3', 'children': []},
							{'val': ')', 'children': []}
						]}
					]
				},
				{
					'val': '@decorator2',
					'type': ParseTreeTokenType.DECORATOR,
					'children': []
				}
				]
		}
	},
	{
		'code': '@decorator1\n@decorator2\n@decorator3\nasync def',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'val': null,
					'type': ParseTreeTokenType.FUNCTION_DEFINITION,
					'children': [
						{'val': '@decorator1','type': ParseTreeTokenType.DECORATOR, 'children': []},
						{'val': '@decorator2','type': ParseTreeTokenType.DECORATOR, 'children': []},
						{'val': '@decorator3','type': ParseTreeTokenType.DECORATOR, 'children': []},
						{'val': 'async','type': ParseTreeTokenType.ASYNC, 'children': []},
						{'val': 'def','type': ParseTreeTokenType.DEF, 'children': []}
					]
				}
			]
		}
	},{
		'code': `def decorator_one(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result
    return wrapper`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'val': null,
					'type': ParseTreeTokenType.FUNCTION_DEFINITION,
					'children': [
						{'val': 'def', 'children': []},
						{'val': 'decorator_one', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': 'func', 'children': []},
							{'val': ')', 'children': []}
						]},
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_DEFINITION, 'children': [
								{'val': 'def'},
								{'val': 'wrapper'},
								{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST},
								{'val': ':', 'type': ParseTreeTokenType.COLON},
								{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
									{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR},
									{'val': 'return', 'type': ParseTreeTokenType.RETURN}
								]},
							]},
							{'val': 'return', 'type': ParseTreeTokenType.RETURN, 'children': [
								{'val': 'wrapper', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
							]}
						]},
				]},
		]}
	}
	];
	processParseTestCases(cases, logger);
};