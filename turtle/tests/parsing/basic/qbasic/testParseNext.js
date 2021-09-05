import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseNext(logger) {
	const cases = [{
		'code': 'next j,i',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'next', 'type': ParseTreeTokenType.NEXT, 'children': [
					{'val': 'j', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				]}
			]
		}
	},{
		'code': `FOR K=1 TO 5
FOR I=2 TO 6
FOR J=3 TO 7
NEXT J,I
NEXT K`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'K', 'children': []},
							{'val': '1', 'children': []}
						]},
						{'val': '5', 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
							{'val': 'TO'},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
						]}
					]},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'K', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `FOR K=0 TO 2
FOR I=1 TO 3
FOR J=2 TO 4
NEXT J,I
V=1
NEXT K`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO', 'children': [
						{'val': '=', 'children': [
							{'val': 'K'},
							{'val': '0'}
						]},
						{'val': '2'}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'FOR'},
						{'val': '=', 'children': [
							{'val': 'V', 'children': []},
							{'val': '1', 'children': []}
						]}
					]},
					{'val': 'NEXT', 'type': ParseTreeTokenType.NEXT, 'children': [
						{'val': 'K', 'children': []}
					]}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};