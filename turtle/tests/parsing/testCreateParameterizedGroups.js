import { configToParseTreeToken } from '../helpers/configToParseTreeToken.js';
import { createParameterizedGroups, getNumberOfArguments, processLeafToken } from '../../modules/parsing/createParameterizedGroups.js';
import { getParseTreeDifferences } from '../helpers/configToParseTreeToken.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js'; 
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js'; 
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { scrapeProceduresFromParseTreeTokens } from '../../modules/parsing/parse-tree-analysis/scrapeProceduresFromParseTreeTokens.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

function stringifyTokens(tokens) {
	return JSON.stringify(tokens.map(t => t.val + ' of type ' + ParseTreeTokenType.getNameFor(t.type)));
}

function testGetNumberOfArguments(logger) {
	const procs = new Map();
	const ifToken = new ParseTreeToken('if', null, 0, 0, ParseTreeTokenType.LEAF);
	let len = getNumberOfArguments(ifToken, procs);
	if (len !== 2)
		logger('if command expects 2 arguments but getNumberOfArguments returned ' + len);
	const orToken = new ParseTreeToken('or', ifToken, 0, 0, ParseTreeTokenType.LEAF);
	len = getNumberOfArguments(orToken, procs);
	if (len !== 2)
		logger('or command expects 2 arguments but getNumberOfArguments returned ' + len);

	const exprToken = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	const sumToken = new ParseTreeToken('sum', exprToken, 1, 0, ParseTreeTokenType.LEAF);
	exprToken.appendChild(new ParseTreeToken('(', null, 0, 0, ParseTreeTokenType.LEAF));
	exprToken.appendChild(sumToken);
	exprToken.appendChild(new ParseTreeToken(')', null, 0, 0, ParseTreeTokenType.LEAF));
	len = getNumberOfArguments(sumToken, procs);
	if (len !== 0)
		logger('sum command expects 0 arguments but getNumberOfArguments returned ' + len + ', this is because the expression is "(sum )" with no arguments.  It is a weird usage of sum but worth testing.');
}

function testProcessLeafToken(logger) {
	const parseLogger = new TestParseLogger(logger, '');
	const procs = new Map();
	const token = new ParseTreeToken('penup', null, 0, 0, ParseTreeTokenType.LEAF);
	processLeafToken(token, procs, parseLogger);
}

function testWithCodeSnippets(logger) {
	const cases = [
		{'code': '',
			'totalParameterizedTokens': 0,
			'numFirstLevelTokens': 0
		},
		{'code': 'fd 100',
			'totalParameterizedTokens': 1,
			'numFirstLevelTokens': 1
		},
		{'code': 'fd sqrt 100',
			'totalParameterizedTokens': 2,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'make "x 10\nfd :x',
			'totalParameterizedTokens': 2,
			'numFirstLevelTokens': 2
		},
		{
			'code': 'make "x 10\nfd :x right 90',
			'totalParameterizedTokens': 3,
			'numFirstLevelTokens': 3
		},
		{
			// procedure with no parameters or instructions
			// "fd" matches a command name but indicating that 
			// should not be validated while parsing or affect createParameterizedGroups.
			'code': 'to fd\nend',
			'totalParameterizedTokens': 0,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'to hi\nifelse false [hi] [hi]\nend',
			'totalParameterizedTokens': 3, // ifelse, hi, and another hi call.
			'numFirstLevelTokens': 1
		},
		{
			'code': 'to hi\nhi\nend',
			'totalParameterizedTokens': 1,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'and true false',
			'totalParameterizedTokens': 1,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'print and true false',
			'totalParameterizedTokens': 2,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'to p\n10\nend',
			'totalParameterizedTokens': 0,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'if true []',
			'totalParameterizedTokens': 1,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'or true false',
			'totalParameterizedTokens': 1,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'if or true false []',
			'totalParameterizedTokens': 2,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'if or 1<>2 1<>0 []',
			'totalParameterizedTokens': 2,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'if or (not 1=2) (not 1=0) []',
			'totalParameterizedTokens': 4,
			'numFirstLevelTokens': 1
		},
		{
			'code': 'make "dx 1 make "dy 2 if or (not :dx=:dy) (not :dx=0) []',
			'totalParameterizedTokens': 6,
			'numFirstLevelTokens': 3
		},
		{
			'code': 'to p\nif 0 = count [] [\n]\nend',
			'totalParameterizedTokens': 2,
			'numFirstLevelTokens': 1
		},
	];
	cases.forEach(function(caseInfo) {
		const log = prefixWrapper('Failure while processing code: ' + caseInfo.code, logger);
		const parseLogger = new TestParseLogger(logger, caseInfo.code);
		const rootToken = LogoParser.getParseTree(caseInfo.code, parseLogger);
		const procedures = new Map();
		if (!parseLogger.hasLoggedErrors()) {
			const proceduresArray = scrapeProceduresFromParseTreeTokens(rootToken);
			proceduresArray.forEach(function(proc) {
				procedures.set(proc.name.toLowerCase(), proc);
			});
			createParameterizedGroups(rootToken, procedures, parseLogger);
		}
		const parameterizedTokens = ParseTreeToken.flatten(rootToken).filter(function(token) {
			return token.type === ParseTreeTokenType.PARAMETERIZED_GROUP;
		});
		if (parameterizedTokens.length !== caseInfo.totalParameterizedTokens)
			log('Expected ' + caseInfo.totalParameterizedTokens + ' parameterized token groups but got ' + parameterizedTokens.length + '. The parameterized token strings are ' + stringifyTokens(parameterizedTokens));
		if (rootToken.children.length !== caseInfo.numFirstLevelTokens)
			log('Expected ' + caseInfo.numFirstLevelTokens + ' tokens on the first level down from the root but got ' + rootToken.children.length + '. The first level token strings are ' + stringifyTokens(rootToken.children));
	});
}

function testWithTokens(logger) {
	const cases = [{
			'in': [
				{'val': 'if', 'colIndex': 1, 'type': ParseTreeTokenType.LEAF},
				{'val': 'or', 'colIndex': 4, 'type': ParseTreeTokenType.LEAF},
				{'val': 'true', 'colIndex': 9, 'type': ParseTreeTokenType.BOOLEAN_LITERAL},
				{'val': 'false', 'colIndex': 15, 'type': ParseTreeTokenType.BOOLEAN_LITERAL},
				{'val': null, 'colIndex': 17, 'type': ParseTreeTokenType.LIST, 'children': [
					{'val': '[', 'colIndex': 17, 'type': ParseTreeTokenType.LEAF},
					{'val': ']', 'colIndex': 18, 'type': ParseTreeTokenType.LEAF}
				]}
			],
			'out': [
				{'val': 'if', 'colIndex': 1, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
					{'val': 'or', 'colIndex': 4, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
						{'val': 'true', 'colIndex': 9, 'type': ParseTreeTokenType.BOOLEAN_LITERAL},
						{'val': 'false', 'colIndex': 15, 'type': ParseTreeTokenType.BOOLEAN_LITERAL}
					]},
					{'val': null, 'colIndex': 17, 'type': ParseTreeTokenType.LIST, 'children': [
						{'val': '[', 'colIndex': 17, 'type': ParseTreeTokenType.LEAF},
						{'val': ']', 'colIndex': 18, 'type': ParseTreeTokenType.LEAF}
					]}
				]}
			]
		}, {
		'in': [
		// simulate 'to p\nif 0 = count [] [\n]\nend'.
			{'val': 'to', 'colIndex': 1, 'type': ParseTreeTokenType.PROCEDURE_START_KEYWORD, 'children': [
				{'val': 'p', 'colIndex': 3, 'type': ParseTreeTokenType.LEAF},
				{'val': null, 'colIndex': 4, 'type': ParseTreeTokenType.LIST},
				{'val': null, 'colIndex': 4, 'type': ParseTreeTokenType.LIST, 'children': [
					{'val': 'if', 'colIndex': 5, 'type': ParseTreeTokenType.LEAF},
					{'val': '=', 'colIndex': 9, 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': 0, 'colIndex': 15, 'type': ParseTreeTokenType.NUMBER_LITERAL},
						{'val': 'count', 'colIndex': 15, 'type': ParseTreeTokenType.LEAF},
					]},
					{'val': null, 'colIndex': 15, 'type': ParseTreeTokenType.LIST, 'children': [
						{'val': '[', 'colIndex': 17, 'type': ParseTreeTokenType.LEAF},
						{'val': ']', 'colIndex': 18, 'type': ParseTreeTokenType.LEAF}
					]},
					{'val': null, 'colIndex': 17, 'type': ParseTreeTokenType.LIST, 'children': [
						{'val': '[', 'colIndex': 17, 'type': ParseTreeTokenType.LEAF},
						{'val': ']', 'colIndex': 18, 'type': ParseTreeTokenType.LEAF}
					]}
				]},
				{'val': 'end', 'colIndex': 15, 'type': ParseTreeTokenType.PROCEDURE_END_KEYWORD},
			]}
		],
		'out': [
			{'val': 'to', 'colIndex': 1, 'type': ParseTreeTokenType.PROCEDURE_START_KEYWORD, 'children': [
				{'val': 'p', 'colIndex': 3, 'type': ParseTreeTokenType.LEAF},
				{'val': null, 'colIndex': 4, 'type': ParseTreeTokenType.LIST},
				{'val': null, 'colIndex': 4, 'type': ParseTreeTokenType.LIST, 'children': [
					{'val': 'if', 'colIndex': 5, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
						{'val': '=', 'colIndex': 9, 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 0, 'colIndex': 15, 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': 'count', 'colIndex': 15, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
								{'val': null, 'colIndex': 15, 'type': ParseTreeTokenType.LIST, 'children': [
									{'val': '[', 'colIndex': 17, 'type': ParseTreeTokenType.LEAF},
									{'val': ']', 'colIndex': 18, 'type': ParseTreeTokenType.LEAF}
								]},
							]},
						]},
						{'val': null, 'colIndex': 17, 'type': ParseTreeTokenType.LIST, 'children': [
							{'val': '[', 'colIndex': 17, 'type': ParseTreeTokenType.LEAF},
							{'val': ']', 'colIndex': 18, 'type': ParseTreeTokenType.LEAF}
						]}
					]},
				]},
				{'val': 'end', 'colIndex': 15, 'type': ParseTreeTokenType.PROCEDURE_END_KEYWORD},
			]}
		]
	}];
	cases.filter(caseInfo => caseInfo.out !== undefined).forEach(function(caseInfo) {
		const parseLogger = new TestParseLogger(logger, '');
		const inTree = configToParseTreeToken(caseInfo.in);
		const outTree = configToParseTreeToken(caseInfo.out);
		createParameterizedGroups(inTree, new Map(), parseLogger);
		const actualOutputTree = inTree; // createParameterizedGroups mutates the inTree instead of returning a new one.
		const differences = getParseTreeDifferences(actualOutputTree, outTree);
		differences.forEach(function(difference) {
			logger(difference);
		});
	});
}

export function testCreateParameterizedGroups(logger) {
	testGetNumberOfArguments(logger);
	testProcessLeafToken(logger);
	testWithCodeSnippets(logger);
	testWithTokens(logger);
};