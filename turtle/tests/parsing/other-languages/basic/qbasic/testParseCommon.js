import { processParseTestCases } from './processParseTestCases.js';

export function testParseCommon(logger) {
	const cases = [{
		'code': `COMMON SHARED x, y
	z`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'COMMON',
					'children':[
						{'val': 'SHARED', 'children': [
							{'val': 'x', 'children': []},
							{'val': ',', 'children': []},
							{'val': 'y', 'children': []},
						]}
					]
				},
				{'val': 'z', 'children': []}
			]
			}
	},
	{
		'code': `DIM t%
COMMON SHARED x`,
		'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'DIM',
				'children': [
					{'val': 't%'},
					]
				},
				{'val': 'COMMON',
					'children':[
						{'val': 'SHARED', 'children': [
							{'val': 'x', 'children': []},
						]}
					]
				}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};