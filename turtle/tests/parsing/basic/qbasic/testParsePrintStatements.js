import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParsePrintStatements(logger) {
	const cases = [{
		'code': 'print',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					]}
				]},
			]
		}
	},{
		'code': 'print\nx',
		'numTopChildren': 2,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					]}
				]},
				{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
			]
		}
	},{
		'code': 'print "hi"',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL}
					]}
				]},
			]
		}
	},{
		'code': 'print "hi";x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL},
						{'val': ';', 'type': ParseTreeTokenType.SEMICOLON},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]},
			]
		}
	},{
		'code': 'print 3',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					]}
				]},
			]
		}
	},{
		'code': 'PRINT "Count is now " + STR$(count)',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'PRINT', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '"Count is now "', 'type': ParseTreeTokenType.STRING_LITERAL},
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'STR$'},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
									{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
									{'val': 'count', 'type': ParseTreeTokenType.IDENTIFIER},
									{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []},
								]}
							]}
						]},
					]}
				]},
			]
		}
	},{
		'code': 'print (y)-x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
								{'val': '(', 'children': []},
								{'val': 'y', 'children': []},
								{'val': ')', 'children': []},
							]},
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]}
					]}
				]}
			]
		}
	},{
		'code': 'print x, y *',
		'parseSettings': {
			'skipScanTokenSanitization': true
		},
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'print', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						]},
					]}
				]}
		]}
	},{
		'code': 'PRINT SPACE$(i); i',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'PRINT', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'SPACE$', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'children': []},
								{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
								{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'children': []},
							]}
						]},
						{'val': ';', 'type': ParseTreeTokenType.SEMICOLON, 'children': []},
						{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]}
				]}
		]}
	}];
	processParseTestCases(cases, logger);
};