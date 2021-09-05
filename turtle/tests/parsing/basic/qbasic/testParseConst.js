import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseConst(logger) {
	const cases = [{
		'code': `CONST x=1, y=2`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'CONST',
					'children':[
						{'val': '=', 'children': [
							{'val': 'x', 'children': []},
							{'val': '1', 'children': []}
						]},
						{'val': ',', 'children': []},
						{'val': '=', 'children': [
							{'val': 'y', 'children': []},
							{'val': '2', 'children': []}
						]},
					]
				},
			]
		}
	},{
		'code': 'CONST x = 1\n80',
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'CONST',
					'children':[
						{'val': '=', 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]},
					]
				},
				{'val': '80', 'type': ParseTreeTokenType.LABEL}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};