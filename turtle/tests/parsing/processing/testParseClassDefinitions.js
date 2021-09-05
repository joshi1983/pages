import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseClassDefinitions(logger) {
	const cases = [
	{'code': `class SetUtils {
	void remove() {
		int toDelete = 2;
	}
}`, 'numTopChildren': 1},
	{'code': `class Utils {
	void f1() {
	}

	void f2() {
		int x = 1;
	}
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.CLASS,
	'val': 'class',
	'children': [
		{'val': 'Utils', 'type': ParseTreeTokenType.IDENTIFIER},
		{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
			{'val': '{'},
			{'val': null, 'type': ParseTreeTokenType.METHOD, 'children': [
				{'val': 'void', 'type': ParseTreeTokenType.VOID},
				{'val': 'f1', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
				{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
			]},
			{'val': null, 'type': ParseTreeTokenType.METHOD, 'children': [
				{'val': 'void', 'type': ParseTreeTokenType.VOID},
				{'val': 'f2', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
				{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
			]},
			{'val': '}'}
		]}
	]
})},
	{'code': `class B extends A{
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.CLASS,
	'val': 'class',
	'children': [
		{'val': 'B', 'children': []},
		{'val': 'extends', 'type': ParseTreeTokenType.EXTENDS, 'children': [
			{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER}
		]},
		{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
			{'val': '{'},
			{'val': '}'}
		]}
	]
	})},
	{'code': 'class A { A() {}}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CLASS,
		'val': 'class',
		'children': [
			{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
				{'val': '{'},
				{'val': 'A', 'type': ParseTreeTokenType.CONSTRUCTOR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '('},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{'},
						{'val': '}'},
					]}
				]},
				{'val': '}'},
			]},
		]
	})
	},
	{'code': 'class A { A() {} void m() {}}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CLASS,
		'val': 'class',
		'children': [
			{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
				{'val': '{'},
				{'val': 'A', 'type': ParseTreeTokenType.CONSTRUCTOR},
				{'val': null, 'type': ParseTreeTokenType.METHOD,
				'children': [
					{'val': 'void', 'type': ParseTreeTokenType.VOID},
					{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]},
				{'val': '}'}
			]},
		]
	})
	},
	{'code': 'class A { A m() {}}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CLASS,
		'val': 'class',
		'children': [
			{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
				{'val': '{'},
				{'val': null, 'type': ParseTreeTokenType.METHOD,
				'children': [
					{'val': 'A', 'type': ParseTreeTokenType.DATA_TYPE},
					{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]},
				{'val': '}'}
			]},
		]
	})
	},
	{'code': 'class A implements B { }', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CLASS,
		'val': 'class',
		'children': [
			{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': 'implements', 'type': ParseTreeTokenType.IMPLEMENTS, 'children': [
				{'val': 'B', 'type': ParseTreeTokenType.IDENTIFIER}
			]},
			{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
				{'val': '{'},
				{'val': '}'}
			]}
		]
	})},
	{'code': 'class A implements B, C { }', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CLASS,
		'val': 'class',
		'children': [
			{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': 'implements', 'type': ParseTreeTokenType.IMPLEMENTS, 'children': [
				{'val': 'B', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': ',', 'type': ParseTreeTokenType.COMMA},
				{'val': 'C', 'type': ParseTreeTokenType.IDENTIFIER}
			]},
			{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
				{'val': '{'},
				{'val': '}'}
			]}
		]
	})},
	{'code': 'class A { int x; }', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CLASS,
		'val': 'class',
		'children': [
			{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
				{'val': '{'},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'val': 'int', 'type': ParseTreeTokenType.DATA_TYPE},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
				]},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON},
				{'val': '}'}
			]}
		]
	})},
	{'code': `static class MiniClass {
  static int y = 10;
}`, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.STATIC,
		'val': 'static',
		'children': [
			{'type': ParseTreeTokenType.CLASS,
			'val': 'class',
			'children': [
				{'val': 'MiniClass', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
					{'val': '{'},
					{'val': 'static', 'type': ParseTreeTokenType.STATIC, 'children': [
						{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
							{'val': 'int', 'type': ParseTreeTokenType.DATA_TYPE, 'children': []},
							{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
								{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER},
								{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL}
							]},
						]},
					]},
					{'val': ';'},
					{'val': '}'},
				]},
			]}
		]
	})}
	];
	processParseTestCases(cases, logger);
};