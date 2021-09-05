import { ParseTreeTokenType } from
'../../../../../modules/parsing/other-languages/joss/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseSet(logger) {
	const cases = [
		{
			'code': `Set x=3`,
			'numTopChildren': 1
		},
		{
			'code': `1.1 Set x=3`,
			'numTopChildren': 1
		},
		{
			'code': `Set x=3.`,
			'numTopChildren': 2,
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.LINE_OF_CODE,
					'children': [
						{'val': 'Set'}
					]
					},
					{'val': '.', 'type': ParseTreeTokenType.PERIOD}
				]
			}
		},
		{
			'code': `1.1 Set x=3.`,
			'numTopChildren': 2,
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.LINE_OF_CODE},
					{'val': '.', 'type': ParseTreeTokenType.PERIOD}
				]
			}
		},
		{
			'code': `Set x=3, y=6`,
			'numTopChildren': 1
		},
		{
			'code': `1.1 Set x=3, y=6`,
			'numTopChildren': 1
		},
		{
			'code': `Set x=3, y=6.`,
			'numTopChildren': 2
		},
		{
			'code': `1.1 Set x=3, y=6.`,
			'numTopChildren': 2
		}
	];
	processParseTestCases(cases, logger);
};