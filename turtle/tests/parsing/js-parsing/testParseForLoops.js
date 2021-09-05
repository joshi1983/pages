import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseForLoops(logger) {
	const cases = [
		{'code': 'for (let i = 0; i < 10; i++) {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.FOR, 'val': 'for',
					'children': [
						{'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'val': null, 'children': [
							{'val': '('},
							{'val': 'let', 'children': [
								{'val': '=', 'children': [
									{'val': 'i'},
									{'val': '0'}
								]},
							]},
							{'val': ';'},
							{'val': '<', 'children': [
								{'val': 'i'},
								{'val': '10'},
							]},
							{'val': ';'},
							{'val': 'i', 'children': [
								{'type': ParseTreeTokenType.UNARY_OPERATOR, 'val': '++'}
							]},
							{'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'val': ')'}
						]},
						{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
							{'val': '{'},
							{'val': '}'}
						]}
					]
				}
			]
		}},
		{'code': 'for (let i = 0; i < 10; i++);', 'numTopChildren': 2, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.FOR, 'val': 'for',
					'children': [
						{'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'val': null, 'children': [
							{'val': '('},
							{'val': 'let', 'children': [
								{'val': '=', 'children': [
									{'val': 'i'},
									{'val': '0'}
								]},
							]},
							{'val': ';'},
							{'val': '<', 'children': [
								{'val': 'i'},
								{'val': '10'},
							]},
							{'val': ';'},
							{'val': 'i', 'children': [
								{'val': '++'}
							]},
							{'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'val': ')'}
						]}
					]
				},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON}
			]
			}
		},
		{
			'code': `for (j = 0; j < scaleFactor; j++) {
	x = (1);
}`, 'numTopChildren': 1
		},
		{'code': `function f() {
	if (true)
		return false
	else {
		do {
			for (let x of y) {}
		} while (true);
	}
}`, 'numTopChildren': 1
		},
		{'code': `function getUncalledProceduresFromCode() {
	if (true)
		return 2
	else {
		do {
			const newlyRequiredProcedureNames2 = 1;
		} while (true);
	}
}`, 'numTopChildren': 1},
	{'code': 'for (const key of this.readAgeMap) {}', 'numTopChildren': 1},
	{'code': 'for (const key in obj) {}', 'numTopChildren': 1}
	];
	processParseTestCases(cases, logger);
};