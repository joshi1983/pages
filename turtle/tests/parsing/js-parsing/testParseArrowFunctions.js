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
	})}
	];
	processParseTestCases(cases, logger);
};