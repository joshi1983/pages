import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseClass(logger) {
	const cases = [
		{'code': 'class A',
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]}
		},
		{'code': 'class Point(',
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'Point', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []}
					]}
				]}
			]}
		},
		{'code': 'class Complex(val real : Double',
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'Complex', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '(', 'children': []},
						{'val': 'val', 'type': ParseTreeTokenType.VAL, 'children': [
							{'val': 'real', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
								{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': [
									{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
										{'val': 'Double', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
									]}
								]}
							]}
						]}
					]}
				]}
			]}
		},
		{'code': `class derived_class_name extends base_class_name {
}`,
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'derived_class_name', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'extends', 'children': [
						{'val': 'base_class_name', 'children': []}
					]},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]
		}
		},
		{'code': `class A {
    val pic = Picture {}
}`, 
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': 'val', 'children': [
							{'val': '=', 'children': [
								{'val': 'pic', 'children': []},
								{'val': 'Picture', 'children': [
									{'val': null}
								]}
							]}
						]},
						{'val': '}', 'children': []}
					]}
				]}
		]}
		},
		{'code': ` class Frog extends Philosophical {
      override def toString = "green"
    }`,
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'Frog', 'children': []},
					{'val': 'extends', 'children': [
						{'val': 'Philosophical', 'children': []}
					]},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': 'override', 'children': [
							{'val': 'def', 'children': [
								{'val': '=', 'children': [
									{'val': 'toString', 'children': []},
									{'val': '"green"', 'children': []}
								]}
							]}
						]},
						{'val': '}', 'children': []}
					]}
				]}
			]}
		},
		{'code': `class C {
    def < () = 
      5
}`,
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'C', 'children': []},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': 'def'},
						{'val': '}', 'children': []}
					]}
				]}
			]}
		},
		{'code': `class C with T {
}`,
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'C', 'children': []},
					{'val': 'with', 'type': ParseTreeTokenType.WITH, 'children': [
						{'val': 'T', 'children': []}
					]},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]}
		},
		{'code': `class C extends A with T {
}`,
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'C', 'children': []},
					{'val': 'extends', 'type': ParseTreeTokenType.EXTENDS, 'children': [
						{'val': 'A', 'children': []}
					]},
					{'val': 'with', 'type': ParseTreeTokenType.WITH, 'children': [
						{'val': 'T', 'children': []}
					]},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]}
		},
		{
			'code': `class Base{
    protected val alpha ="Alpha";
    protected def sayHello = "Hello";
}`,
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'Base', 'children': []},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': 'protected', 'children': [
							{'val': 'val'}
						]},
						{'val': 'protected', 'children': [
							{'val': 'def'}
						]},
						{'val': '}', 'children': []}
					]},
				]}
			]}
		},
		{'code': `class A {
    override protected[yourPackageName] def someFunction`,
		'treeInfo': {
			'children': [
				{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
					{'val': 'A', 'children': []},
					{'val': null, 'children': [
						{'val': '{', 'children': []},
						{'val': 'override', 'type': ParseTreeTokenType.OVERRIDE, 'children': [
							{'val': 'protected', 'type': ParseTreeTokenType.PROTECTED, 'children': [
								{'val': null, 'type': ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION, 'children': [
									{'val': '[', 'children': []},
									{'val': 'yourPackageName', 'children': []},
									{'val': ']', 'children': []}
								]},
								{'val': 'def', 'type': ParseTreeTokenType.DEF}
							]}
						]}
					]}
				]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}