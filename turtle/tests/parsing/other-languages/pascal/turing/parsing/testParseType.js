import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseType(logger) {
	const cases = [
	{
		'code': 'type',
		'treeInfo': {
			'children': [
				{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': []}
			]
		}
	},{
		'code': 'type v',
		'treeInfo': {
			'children': [
				{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'v', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},{
		'code': 'type v:record',
		'treeInfo': {
			'children': [
				{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'v', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': 'record', 'type': ParseTreeTokenType.RECORD, 'children': []},
				]}
			]
		}
	},{
		'code': 'type v:record end record',
		'treeInfo': {
			'children': [
				{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'v', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': 'record', 'type': ParseTreeTokenType.RECORD, 'children': [
						{'val': null, 'type': ParseTreeTokenType.END_RECORD, 'children': [
							{'val': 'end', 'children': []},
							{'val': 'record', 'children': []}
						]}
					]},
				]}
			]
		}
	},{
		'code': 'type v:record end record put "hi"',
		'treeInfo': {
			'children': [
				{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'v', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': 'record', 'type': ParseTreeTokenType.RECORD, 'children': [
						{'val': null, 'type': ParseTreeTokenType.END_RECORD, 'children': [
							{'val': 'end', 'children': []},
							{'val': 'record', 'children': []}
						]}
					]},
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'put', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '"hi"', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'type nameType : string(30)',
		'treeInfo': {
			'children': [
				{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'nameType', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
						{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': 'string', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
								{'val': '(', 'children': []},
								{'val': '30', 'children': []},
								{'val': ')', 'children': []}
							]}
						]}
					]}
				]}
			]
		}
	},{
		'code': 'type v:union',
		'treeInfo': {
			'children': [
				{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'v', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': 'union', 'type': ParseTreeTokenType.UNION, 'children': []},
				]}
			]
		}
	},{
		'code': 'type v : set of 0 .. 2',
		'treeInfo': {
			'children': [
				{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
					{'val': 'v', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
						{'val': 'set', 'type': ParseTreeTokenType.CONTAINER_TYPE, 'children': [
							{'val': 'of'}
						]}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};