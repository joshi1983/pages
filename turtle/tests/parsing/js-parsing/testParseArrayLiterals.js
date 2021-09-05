import { processParseTestCases } from './processParseTestCases.js';

export function testParseArrayLiterals(logger) {
	const cases = [
	{'code': `function f() {
}
['change'].forEach`, 'numTopChildren': 2},
	{'code': '[[20,1.8265],[-202.7,0.29224]]', 'numTopChildren': 1},
	{'code': `const x = []
const y = 2`, 'numTopChildren': 2},
	{'code': `if (x)
	[a, b] = [b, a];`, 'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'if', 'children': [
					{'val': null, 'children': [
						{'val': '(', 'children': []},
						{'val': 'x', 'children': []},
						{'val': ')', 'children': []}
					]},
					{'val': null, 'children': [
						{'val': '=', 'children': [
							{'val': null, 'children': [
								{'val': '[', 'children': []},
								{'val': 'a', 'children': []},
								{'val': ',', 'children': []},
								{'val': 'b', 'children': []},
								{'val': ']', 'children': []},
							]},
							{'val': null, 'children': [
								{'val': '[', 'children': []},
								{'val': 'b', 'children': []},
								{'val': ',', 'children': []},
								{'val': 'a', 'children': []},
								{'val': ']', 'children': []},
							]},
						]},
						{'val': ';', 'children': []}
					]}
				]}
			]
		}
	}
];
	processParseTestCases(cases, logger);
};