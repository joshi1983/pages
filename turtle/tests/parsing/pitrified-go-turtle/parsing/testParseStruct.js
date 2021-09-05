import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseStruct(logger) {
	const cases = [
		{'code': 'f(person{"Bob", 20})', 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
				{'val': 'f', 'children': []},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '(', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.STRUCT_INITIALIZATION, 'children': [
						{'val': 'person', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.STRUCT_VALUES_EXPRESSION, 'children': [
							{'val': '{', 'children': []},
							{'val': '"Bob"', 'children': []},
							{'val': ',', 'children': []},
							{'val': '20', 'children': []},
							{'val': '}', 'children': []}
						]}
					]},
					{'val': ')', 'children': []}
				]}
			]}
		]}
		},
		{
			'code': `type Vertex struct {
	X int
	Y int
}`,
			'treeInfo': {
				'children': [
					{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
						{'val': 'Vertex', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'struct', 'type': ParseTreeTokenType.STRUCT, 'children': [
							{'val': '{', 'children': []},
							{'val': 'X', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
								{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
									{'val': 'int', 'children': []}
								]}
							]},
							{'val': 'Y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
								{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
									{'val': 'int', 'children': []}
								]}
							]},
							{'val': '}', 'children': []}
						]},
					]}
				]
			}
		},
		{
			'code': `var tests = []struct {
        a int
    }{
        {0},
        {1}
    }`,
			'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': '=', 'children': [
							{'val': 'tests', 'children': []},
							{'val': null}
						]}
					]}
				]
			}
		},
		{
			'code': `func f() {
	g(&image.Uniform{`,
			'treeInfo': {
				'children': [
					{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
						{'val': 'f', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
								{'val': 'g', 'children': []},
								{'val': null, 'children': [
									{'val': '('},
									{'val': '&', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
										{'val': null, 'type': ParseTreeTokenType.STRUCT_INITIALIZATION, 'children': [
											{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
												{'val': 'image', 'children': []},
												{'val': '.', 'children': []},
												{'val': 'Uniform', 'children': []}
											]},
											{'val': null, 'type': ParseTreeTokenType.STRUCT_VALUES_EXPRESSION,
											'children': [
												{'val': '{', 'children': []}
											]
											}
										]}
									]}
								]}
							]}
						]}
					]}
				]}
		},
		{
			'code': `type World struct {
	Image *`,
			'treeInfo': {
				'children': [
					{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
						{'val': 'World', 'children': []},
						{'val': 'struct', 'children': [
							{'val': '{', 'children': []},
							{'val': 'Image', 'children': [
								{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
									{'val': '*'}
								]}
							]},
						]}
					]}
				]
			}
		},
		{
			'code': `type Plant struct {
    XMLName xml.Name \`xml:"plant"\`
}`,
			'treeInfo': {
				'children': [
					{'val': 'type', 'type': ParseTreeTokenType.TYPE, 'children': [
						{'val': 'Plant', 'children': []},
						{'val': 'struct', 'children': [
							{'val': '{', 'children': []},
							{'val': 'XMLName', 'children': [
								{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
									{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
										{'val': 'xml', 'children': []},
										{'val': '.', 'children': []},
										{'val': 'Name', 'children': []},
									]},
									{'val': '`xml:"plant"`', 'children': []},
								]}
							]},
							{'val': '}', 'children': []},
						]}
					]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};