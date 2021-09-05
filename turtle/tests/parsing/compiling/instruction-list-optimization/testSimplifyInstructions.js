import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { JavaScriptInstruction } from '../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { LogoInstruction } from '../../../../modules/parsing/execution/instructions/LogoInstruction.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Procedure } from '../../../../modules/parsing/Procedure.js';
import { simplifyInstructions } from '../../../../modules/parsing/compiling/instruction-list-optimization/simplifyInstructions.js';

function processCases(cases, logger, proceduresMap) {
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map.  Not: ' + proceduresMap);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instructions = instructionsDTOToInstructions(caseInfo.instructionsDTO, proceduresMap);
		simplifyInstructions(instructions, undefined, false, {'translateToJavaScript': true});
		const mergeInstructions = instructionsDTOToInstructions(caseInfo.instructionsDTO, proceduresMap);
		simplifyInstructions(mergeInstructions, undefined, false, {'translateToJavaScript': true, 'mergeJavaScriptInstructions': true});
		if (mergeInstructions.length !== caseInfo.mergeLength) {
			console.log(mergeInstructions.map(i => i.toDTO()));
			plogger(`With mergeJavaScriptInstruction true, expected length of ${caseInfo.mergeLength} but got ${mergeInstructions.length}`);
		}
		if (instructions.length !== caseInfo.length)
			plogger(`Expected length of ${caseInfo.length} but got ${instructions.length}`);
		else if (caseInfo.types instanceof Array)
			caseInfo.types.forEach(function(constructorName, instructionIndex) {
				const instruction = instructions[instructionIndex];
				if (instruction.constructor.name !== constructorName)
					plogger(`Expected a ${constructorName} at instruction index ${instructionIndex} but got ${instruction.constructor.name}`);
			});
	});
}

function testBinaryOperator(logger) {
	const nameToken = new ParseTreeToken('name', null, 0, 0, ParseTreeTokenType.LEAF);
	const proceduresMap = new Map([
		['p', new Procedure('p', [], nameToken)]
	]);
	const cases = [
		{
			'instructionsDTO': [
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'push', 'value': 4, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '+'}
			],
			'length': 1,
			'mergeLength': 1,
			'types': [
				'JavaScriptInstruction'
			]
		},
		{
			'instructionsDTO': [
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2},
				{'name': 'pop'},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 4, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '+'}
			],
			'length': 2,
			'types': [
				'JavaScriptInstruction',
				'JavaScriptInstruction'
			],
			'mergeLength': 1
		},
		{
			'instructionsDTO': [
				{'name': 'call-proc', 'procName': 'p'},
				{'name': 'push', 'value': 4, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '+'}
			],
			'length': 2,
			'types': [
				'CallProcedureInstruction',
				'JavaScriptInstruction'
			],
			'mergeLength': 2
		}
	];
	processCases(cases, logger, proceduresMap);
};

function testIfElseExpressionFiltered(logger) {
	const proceduresMap = new Map();
	const cases = [{/*
		Simialar to the following compiled:
		print ifelse :x > 1 2 3
		*/
			'instructionsDTO': [
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '>'},
				{'name': 'jump-if-true', 'newIndex': 5},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'jump', 'newIndex': 7},
				{'name': 'push', 'value': 3, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
				{'name': 'pop'},
			],
			'types': [
				'JavaScriptInstruction',
				'JumpIfTrueInstruction',
				'JavaScriptInstruction',
				'JumpInstruction',
				'JavaScriptInstruction',
				'CallCommandInstruction'
			],
			'length': 7,
			'mergeLength': 6
		}
	];
	processCases(cases, logger, proceduresMap);
}

export function testSimplifyInstructions(logger) {
	testBinaryOperator(prefixWrapper('testBinaryOperator', logger));
	testIfElseExpressionFiltered(prefixWrapper('testIfElseExpressionFiltered', logger));
};