import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseUnaryOperator(logger) {
	const cases = [
	{
		'code': 'put -x',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
				'children': [
					{},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR,
						'children': [
							{'val': 'x', 'children': []}
						]}
					]}
				]}
			]
		}
	},
	{
		'code': 'for x: -y',
		'treeInfo': {
			'children': [
				{'val': 'for',
				'children': [
					{'val': 'x'},
					{'val': ':'},
					{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR,
					'children': [
						{'val': 'y', 'children': []}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};