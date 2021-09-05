import { ParseTreeTokenType } from
'../../../../../modules/parsing/other-languages/joss/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseLet(logger) {
	const cases = [
		{
			'code': `Let f(x)=3`,
			'numTopChildren': 1
		},
		{
			'code': `1.1 Let f(x)=3`,
			'numTopChildren': 1
		},
		{
			'code': `Let f(x)=3.`,
			'numTopChildren': 2,
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.LINE_OF_CODE,
					'children': [
							{'val': 'Let'}
						]
					},
					{'val': '.', 'type': ParseTreeTokenType.PERIOD}
				]
			}
		},
		{
			'code': `1.1 Let f(x)=3.`,
			'numTopChildren': 2
		},
		{
			'code': `Let f(x,y)=x+y`,
			'numTopChildren': 1
		},
		{
			'code': `1.1 Let f(x,y)=x+y`,
			'numTopChildren': 1
		},
		{
			'code': `Let f(x,y)=x+y.`,
			'numTopChildren': 2
		},
		{
			'code': `1.1 Let f(x,y)=x+y.`,
			'numTopChildren': 2
		}
	];
	processParseTestCases(cases, logger);
};