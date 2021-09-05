import { parse } from '../../../modules/parsing/sonic-webturtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/sonic-webturtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParsePrint(logger) {
	const cases = [
	{'code': 'print Hello World!!!.', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'print', 'type': ParseTreeTokenType.COMMAND,
			'children': [
				{'val': 'Hello World!!!.', 'type': ParseTreeTokenType.STRING_LITERAL},
			]}
		]
	}},
	{'code': 'print repeat', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'print', 'type': ParseTreeTokenType.COMMAND,
			'children': [
				{'val': 'repeat', 'type': ParseTreeTokenType.STRING_LITERAL},
			]}
		]
	}},
	{'code': 'print end', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'print', 'type': ParseTreeTokenType.COMMAND,
			'children': [
				{'val': 'end', 'type': ParseTreeTokenType.STRING_LITERAL},
			]}
		]
	}},
	{'code': 'print go', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'print', 'type': ParseTreeTokenType.COMMAND,
			'children': [
				{'val': 'go', 'type': ParseTreeTokenType.STRING_LITERAL},
			]}
		]
	}},
	{'code': 'print endif', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'print', 'type': ParseTreeTokenType.COMMAND,
			'children': [
				{'val': 'endif', 'type': ParseTreeTokenType.STRING_LITERAL},
			]}
		]
	}},
	{'code': 'print ^1', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'print', 'type': ParseTreeTokenType.COMMAND,
			'children': [
				{'val': '^1', 'type': ParseTreeTokenType.INPUT_REFERENCE},
			]}
		]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};