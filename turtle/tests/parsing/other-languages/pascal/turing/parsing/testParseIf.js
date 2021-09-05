import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseIf(logger) {
	const cases = [
	{
		'code': 'if x',
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},{
		'code': 'if x < 12',
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '12', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'if x < 12 then',
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '12', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': 'then', 'type': ParseTreeTokenType.THEN, 'children': []}
				]}
			]
		}
	},{
		'code': 'if x < 12 then\nend if',
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '12', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
					{'val': 'then', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'if', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `if intensity < 1 then
elsif intensity > maxShades then
end if`,
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<'},
					{'val': 'then', 'type': ParseTreeTokenType.THEN},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'elsif', 'type': ParseTreeTokenType.ELSIF, 'children': [
						{'val': '>'},
						{'val': 'then', 'type': ParseTreeTokenType.THEN},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'if', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `if intensity < 1 then
elsif intensity > maxShades then
else
end if`,
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<'},
					{'val': 'then', 'type': ParseTreeTokenType.THEN},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'elsif', 'type': ParseTreeTokenType.ELSIF, 'children': [
						{'val': '>'},
						{'val': 'then', 'type': ParseTreeTokenType.THEN},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					]},
					{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'if', 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `if intensity < 1 then
elsif intensity > maxShades then
elsif intensity > maxShades then
else
end if`,
		'treeInfo': {
			'children': [
				{'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
					{'val': '<'},
					{'val': 'then', 'type': ParseTreeTokenType.THEN},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': 'elsif', 'type': ParseTreeTokenType.ELSIF, 'children': [
						{'val': '>'},
						{'val': 'then', 'type': ParseTreeTokenType.THEN},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					]},
					{'val': 'elsif', 'type': ParseTreeTokenType.ELSIF, 'children': [
						{'val': '>'},
						{'val': 'then', 'type': ParseTreeTokenType.THEN},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					]},
					{'val': 'else', 'type': ParseTreeTokenType.ELSE, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []}
					]},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'end', 'children': []},
						{'val': 'if', 'children': []}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};