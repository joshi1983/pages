import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseEllipsis(logger) {
	const cases = [
	{'code': 'func f( nums ...int)',
		'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'nums', 'children': [
							{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
								{'val': '...', 'type': ParseTreeTokenType.TRIPLE_DOT, 'children': []},
								{'val': 'int', 'children': []}
							]}
						]},
						{'val': ')', 'children': []}
					]}
				]}
			]
		}
	},
	{'code': 'f( nums ...)',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
					{'val': 'f', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'nums', 'children': []},
						{'val': '...', 'type': ParseTreeTokenType.TRIPLE_DOT, 'children': []},
						{'val': ')', 'children': []}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};