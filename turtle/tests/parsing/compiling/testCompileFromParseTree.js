import { compareInstructionsDTOWithInstructions } from '../../helpers/compareInstructionsDTOWithInstructions.js';
import { compile } from '../../../modules/parsing/compile.js';
import { configToParseTreeToken } from '../../helpers/configToParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testCompileFromParseTree(logger) {
	const cases = [
		{
			'in': [
				{'val': 'make', 'colIndex': 3, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
					{'val': 'x', 'colIndex': 5, 'type': ParseTreeTokenType.STRING_LITERAL},
					{'val': 1, 'colIndex': 7, 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]}
			],
			'instructionsDTO': [
				{
					'name': 'push',
					'value': 'x',
					'isCloningValue': false
				},
				{
					'name': 'push',
					'value': 1,
					'isCloningValue': false
				},
				{
					'name': 'call-cmd',
					'commandName': 'make',
					'numArgs': 2,
					"skipValidationAndSanitization":false
				},
				{
					'name': 'pop'
				}
			]
		},
		{
			'in': [ // parse tree for something like 'make "x 1 print -:x'
				{'val': 'make', 'colIndex': 3, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
					{'val': 'x', 'colIndex': 5, 'type': ParseTreeTokenType.STRING_LITERAL},
					{'val': 1, 'colIndex': 7, 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]},
				{'val': 'print', 'colIndex': 13, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'children': [
					{'val': '-', 'colIndex': 15, 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
						{'val': 'x', 'colIndex': 17, 'type': ParseTreeTokenType.VARIABLE_READ}
					]}
				]}
			],
			'instructionsDTO': [
				{
					'name': 'push',
					'value': 'x',
					'isCloningValue': false
				},
				{
					'name': 'push',
					'value': 1,
					'isCloningValue': false
				},
				{
					'name': 'call-cmd',
					'commandName': 'make',
					'numArgs': 2,
					"skipValidationAndSanitization":false
				},
				{
					'name': 'pop'
				},
				{
					'name': 'read-variable',
					'variableName': 'x'
				},
				{
					'name': 'unary-operator',
					'symbol': '-'
				},
				{
					'name': 'call-cmd',
					'commandName': 'print',
					'numArgs': 1,
					"skipValidationAndSanitization":false
				},
				{
					'name': 'pop'
				}
			]
		}
	];
	cases.forEach(function(caseInfo) {
		const tree = configToParseTreeToken(caseInfo.in, logger);
		const parseLogger = new TestParseLogger(logger, '');
		const program = compile(undefined, tree, parseLogger, new Map(), {'translateToJavaScript': false}, new Map());
		compareInstructionsDTOWithInstructions(caseInfo.instructionsDTO, program.instructions, logger);
	});
};