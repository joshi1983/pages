import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseArrowFunctions(logger) {
	const cases = [
	{'code': '() => {}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'val': '=>',
		'type': ParseTreeTokenType.BINARY_OPERATOR,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
				{'val': '('},
				{'val': ')'}
			]},
			{
				'val': null,
				'children': [
					{'val': '{'},
					{'val': '}'}
				]
			}
		]
	})},
	{'code': '(resolve, _) => {}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'val': '=>',
		'type': ParseTreeTokenType.BINARY_OPERATOR,
		'children': [
			{'type': ParseTreeTokenType.ARG_LIST, 'children': [
				{'val': '('},
				{'val': 'resolve'},
				{'val': ','},
				{'val': '_'},
				{'val': ')'}
			]},
			{'val': null,
			'children': [
				{'val': '{'},
				{'val': '}'}
			]}
		]
	})},
	//{'code': '(x => x)(0)', 'numTopChildren': 1},
	//{'code': 'console.log((x => x)(0))', 'numTopChildren': 1},
	//{'code': '1 < (x => x)(0)', 'numTopChildren': 1},
	//{'code': 'console.log(1 < (x => x)(0))', 'numTopChildren': 1},
	];
	processParseTestCases(cases, logger);
};