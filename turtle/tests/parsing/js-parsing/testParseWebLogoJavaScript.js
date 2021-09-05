import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseWebLogoJavaScript(logger) {
	const cases = [
		{'code': '((context.getCurrentExecutingProcedure().localVariables.get("oldre")) * (context.getCurrentExecutingProcedure().localVariables.get("oldre")))',
			'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'val': null,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '('},
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION}
						]},
						{'val': ')'}
					]}
				]
			}
		},
		{'code': '(((context.getCurrentExecutingProcedure().localVariables.get("oldre"))))', 'numTopChildren': 1,
		'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'val': null,
				'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '('},
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
									{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
										{'val': 'context', 'children': [
											{'val': '.', 'children': [
												{'val': 'getCurrentExecutingProcedure', 'children': []}
											]}
										]},
										{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
									]},
									{'val': '.', 'children': [
										{'val': 'localVariables', 'children': [
											{'val': '.', 'children': [
												{'val': 'get', 'children': []}
											]}
										]}
									]},
								]},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
									{'val': '('},
									{'val': '"oldre"'},
									{'val': ')'}
								]}
							]},
							{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
						]},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
					]},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]}
				]
			}
		},
		{'code': '((context.getCurrentExecutingProcedure().localVariables.get("oldre")) * (3)) - 4',
		'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '-', 'children': [
					{'val': null, 'children': [
						{'val': '('},
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
								{'val': '('},
								{'val': '3'},
								{'val': ')'}
							]}
						]},
						{'val': ')'}
					]},
					{'val': '4'}
				]}
			]
		}},
		{'code': '(((context.getCurrentExecutingProcedure().localVariables.get("oldre")) * (3)) - ((4) * (5))) + -0.704029749122184',
		'numTopChildren': 1,'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'val': null,
				'children': [
					{'val': '+'}
				]
		}},
		{'code': '(((context.getCurrentExecutingProcedure().localVariables.get("oldre")) * (context.getCurrentExecutingProcedure().localVariables.get("oldre"))) - ((context.getCurrentExecutingProcedure().localVariables.get("oldim")) * (context.getCurrentExecutingProcedure().localVariables.get("oldim")))) + -0.704029749122184',
			'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'val': null,
				'children': [
					{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '('},
							{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'va': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
									{'val': '('},
									{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
										{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
											{'val': '('},
											{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
												{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
													{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
														{'val': 'context', 'type': ParseTreeTokenType.IDENTIFIER},
														{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
													]},
													{'val': '.', 'type': ParseTreeTokenType.DOT}
												]},
												{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
											]},
											{'val': ')'}
										]},
										{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
											{'val': '('},
											{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
												{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT, 'children': [
													{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
														{'val': 'context', 'type': ParseTreeTokenType.IDENTIFIER},
														{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
													]},
													{'val': '.', 'type': ParseTreeTokenType.DOT}
												]},
												{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
											]},
											{'val': ')'}
										]}
									]},
									{'val': ')'}
								]},
								{'va': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION}
							]},
							{'val': ')'}
						]},
						{'val': '-0.704029749122184'}
					]},
				]}
		},/*
		{'code': 'context.localmake("x",(((context.getCurrentExecutingProcedure().localVariables.get("oldre")) * (context.getCurrentExecutingProcedure().localVariables.get("oldre"))) - ((context.getCurrentExecutingProcedure().localVariables.get("oldim")) * (context.getCurrentExecutingProcedure().localVariables.get("oldim")))) + -0.704029749122184)',
			'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'val': null,
				'children': [
					{'val': 'context', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
						{'val': '.', 'children': [
							{'val': 'localmake', 'children': [
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
									{'val': '('},
									{'val': '"x"', 'type': ParseTreeTokenType.STRING_LITERAL},
									{'val': ',', 'type': ParseTreeTokenType.COMMA},
									{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
										{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
											{'val': '('},
											{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
												{'va': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
													{'val': '('},
													{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
														{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
															{'val': '('},
															{'val': 'context', 'type': ParseTreeTokenType.IDENTIFIER},
															{'val': ')'}
														]},
														{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
															{'val': '('},
															{'val': 'context', 'type': ParseTreeTokenType.IDENTIFIER},
															{'val': ')'}
														]}
													]},
													{'val': ')'}
												]},
												{'va': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION}
											]},
											{'val': ')'}
										]},
										{'val': '-0.704029749122184'}
									]},
									{'val': ')'}
								]}
							]}
						]}
					]}
				]
			}
		}*/
	];
	processParseTestCases(cases, logger);
};