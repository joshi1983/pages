import { configToParseTreeToken } from '../../helpers/configToParseTreeToken.js';
import { evaluateToken } from '../../../modules/parsing/parse-tree-analysis/evaluateToken.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';

export function testEvaluateToken(logger) {
	const cases = [
	{
		'token': new ParseTreeToken(5, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL),
		'result': 5
	},
	{
		'token': new ParseTreeToken(true, null, 0, 0, ParseTreeTokenType.BOOLEAN_LITERAL),
		'result': true
	},
	{
		'token': new ParseTreeToken(false, null, 0, 0, ParseTreeTokenType.BOOLEAN_LITERAL),
		'result': false
	},
	{
		'token': new ParseTreeToken("hi", null, 0, 0, ParseTreeTokenType.STRING_LITERAL),
		'result': "hi"
	},
	{
		'token': new ParseTreeToken("hi world", null, 0, 0, ParseTreeTokenType.LONG_STRING_LITERAL),
		'result': "hi world"
	},
	{
		'token': [
			{'val': '+', 'colIndex': 1, 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
				{'val': 4, 'colIndex': 0, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
				{'val': 5, 'colIndex': 2, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
			]}
		],
		'result': 9
	},
	{
		'token': [
			{'val': '*', 'colIndex': 1, 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
				{'val': 4, 'colIndex': 0, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
				{'val': 5, 'colIndex': 2, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
			]}
		],
		'result': 20
	},
	{
		'token': [
			{'val': '<', 'colIndex': 1, 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
				{'val': 4, 'colIndex': 0, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
				{'val': 5, 'colIndex': 2, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
			]}
		],
		'result': true
	},
	{
		'token': [
			{'val': '>', 'colIndex': 1, 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
				{'val': 4, 'colIndex': 0, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
				{'val': 5, 'colIndex': 2, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
			]}
		],
		'result': false
	},
	{
		'token': [
			{'val': '=', 'colIndex': 1, 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
				{'val': 4, 'colIndex': 0, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
				{'val': 5, 'colIndex': 2, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
			]}
		],
		'result': false
	},
	{
		'token': [
			{'val': 'sqrt', 'colIndex': 3, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
				{'val': 100, 'colIndex': 8, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
			]}
		],
		'result': 10
	},
	{
		'token': [
			{'val': 'fd', 'colIndex': 3, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
				{'val': 100, 'colIndex': 8, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
			]}
		],
		'result': null
	},
	{
		'token': [
			{'val': 'first', 'colIndex': 3, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
				{'val': null, 'colIndex': 8, 'type': ParseTreeTokenType.LIST, 'children': [
					{'val': '[', 'colIndex': 8, 'type': ParseTreeTokenType.LEAF, 'children': []},
						{'val': 3, 'colIndex': 9, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					{'val': ']', 'colIndex': 15, 'type': ParseTreeTokenType.LEAF, 'children': []}
				]},
			]}
		],
		'result': 3
	},
	{
		'token': [
			{'val': '-', 'colIndex': 3, 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
				{'val': 100, 'colIndex': 8, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
			]}
		],
		'result': -100
	},
	];
	cases.filter(ci => ci.token instanceof Array).forEach(function(caseInfo) {
		const rootToken = configToParseTreeToken(caseInfo.token);
		caseInfo.token = rootToken.children[0];
	});
	const proceduresMap = new Map();
	cases.forEach(function(caseInfo) {
		const result = evaluateToken(caseInfo.token, proceduresMap);
		if (result !== caseInfo.result)
			logger('Expected result of ' + caseInfo.result + ' but got ' + result);
	});
};