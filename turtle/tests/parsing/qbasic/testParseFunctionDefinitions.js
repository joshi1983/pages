import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFunctionDefinitions(logger) {
	const cases = [{
		'code': `FUNCTION frac ()
END FUNCTION`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'END'},
						{'val': 'FUNCTION'}
					]}
				]},
			]
		}
	},{
		'code': 'FUNCTION frac () frac',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]}
	},{
		'code': 'FUNCTION frac () frac=',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'children': [
							{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]}
					]}
				]}
			]}
	},{
		'code': 'FUNCTION frac () frac=x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]}
					]}
				]}
			]}
	},{
		'code': `FUNCTION frac (number)
frac = number - INT(number)
END FUNCTION`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': 'number'},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'frac', 'children': []},
							{'val': '-', 'children': [
								{'val': 'number'},
								{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
								'children': [
									{'val': 'INT'},
									{'val': null, 'children': [
										{'val': '('},
										{'val': 'number'},
										{'val': ')'}
									]}
								]}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'END'},
						{'val': 'FUNCTION'}
					]}
				]},
			]
		}
	},{
		'code': 'FUNCTION frac (n) frac',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]}
				]}
		]}
	},{
		'code': 'FUNCTION frac (n) frac =',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						]}
					]}
				]}
		]}
	},{
		'code': 'FUNCTION frac (n) frac = number',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': 'number', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						]}
					]}
				]}
			]}
	},{
		'code': 'FUNCTION frac (n) frac = number + 2',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': 'n', 'children': []},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
							{'val': 'frac', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': 'number', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
								{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							]},
						]}
					]}
				]}
			]}
	},{
		'code': `FUNCTION f
END FUNCTION`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'END', 'children': []},
						{'val': 'FUNCTION', 'children': []}
					]}
				]}
		]}
	},,{
		'code': `function Set()
end function

SELECT`,
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'Set', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'end', 'type': ParseTreeTokenType.END, 'children': []},
						{'val': 'function', 'type': ParseTreeTokenType.FUNCTION, 'children': []}
					]}
				]},
				{'val': 'SELECT', 'type': ParseTreeTokenType.SELECT}
			]}
	},{
		'code': `FUNCTION function1 ()
    SELECT CASE x
    END SELECT
END FUNCTION`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'function1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'SELECT', 'children': [
							{'val': 'CASE', 'children': [
								{'val': 'x', 'children': []}
							]},
							{'val': null, 'children': [
								{'val': 'END', 'children': []},
								{'val': 'SELECT', 'children': []}
							]}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_FUNCTION, 'children': [
						{'val': 'END', 'children': []},
						{'val': 'FUNCTION', 'children': []}
					]}
				]}
		]}
	},{
		'code': `FUNCTION function1
FOR`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
					{'val': 'function1', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
				]}
		]}
	},{
		'code': 'DECLARE FUNCTION functionName (arg1(), arg2',
		/*
		I don't confidently understand the usage of () on an argument/parameter in a function definition like this but
		it is found in the example george-gardei-draw.txt.
		It might be indicating that the argument/parameter's data type is a function or subroutine 
		instead of something else like an integer, string... but that's mostly a speculation.
		*/
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DECLARE', 'type': ParseTreeTokenType.DECLARE, 'children': [
					{'val': 'FUNCTION', 'type': ParseTreeTokenType.FUNCTION, 'children': [
						{'val': 'functionName', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': 'arg1', 'children': []},
							{'val': null, 'children': [
								{'val': '('},
								{'val': ')'},
							]},
							{'val': ',', 'children': []},
							{'val': 'arg2', 'children': []}
						]}
					]}
				]}
		]}
	}];
	processParseTestCases(cases, logger);
};