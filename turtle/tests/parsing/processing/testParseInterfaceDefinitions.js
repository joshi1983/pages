import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseInterfaceDefinitions(logger) {
	const cases = [
	{'code': `interface A {}
}`, 'numTopChildren': 1},
	{'code': `interface A extends B {}`, 'numTopChildren': 1},
	{'code': `interface A extends B, C {}`, 'numTopChildren': 1},
	{'code': `interface A {
	void f1();

	void f2();
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.INTERFACE,
	'val': 'interface',
	'children': [
		{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER},
		{'val': null, 'type': ParseTreeTokenType.INTERFACE_BODY, 'children': [
			{'val': '{'},
			{'val': null, 'type': ParseTreeTokenType.METHOD, 'children': [
				{'val': 'void', 'type': ParseTreeTokenType.VOID},
				{'val': 'f1', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
			]},
			{'val': ';'},
			{'val': null, 'type': ParseTreeTokenType.METHOD, 'children': [
				{'val': 'void', 'type': ParseTreeTokenType.VOID},
				{'val': 'f2', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
			]},
			{'val': ';'},
			{'val': '}'}
		]}
	]
})},
	];
	processParseTestCases(cases, logger);
};