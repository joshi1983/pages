import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseIfElse(logger) {
	const cases = [
	{'code': '#if (2< x)\n#else', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#if', 'type': ParseTreeTokenType.IF,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
						'children': [
							{'val': '('},
							{'val': '<'},
							{'val': ')'}
						]
					},
					{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST},
					{'val': '#else', 'type': ParseTreeTokenType.ELSE,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST},
					]}
				]
			}
		]
	}},
	{'code': '#if (2< x)\n#else\n#end', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#if', 'type': ParseTreeTokenType.IF,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
					'children': [
						{'val': '('},
						{'val': '<'},
						{'val': ')'}
					]},
					{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST},
					{'val': '#else', 'type': ParseTreeTokenType.ELSE,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST},
					]},
					{'val': '#end', 'type': ParseTreeTokenType.END}
				]
			}
		]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};