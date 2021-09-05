import { instructionToJavaScriptInstruction } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/instructionToJavaScriptInstruction.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { JavaScriptInstruction } from '../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testInstructionToJavaScriptInstruction(logger) {
	const cases = [
		{// similar to '5'
			'instructionsDTO': [
				{'name': 'push', 'value': 5, 'isCloningValue': false}
			]
		},
		{// similar to '5 + 19'
			'instructionsDTO': [
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'push', 'value': 19, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '+'}
			]
		},
		{// similar to 'print 5'
			'instructionsDTO': [
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1, 'skipValidationAndSanitization': true}
			]
		},
		{ // similar to ':x'
			'instructionsDTO': [
				{'name': 'read-variable', 'variableName': 'x'}
			]
		},
		{ // similar to '-:x'
			'instructionsDTO': [
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'unary-operator', 'symbol': '-'}
			]
		},
		{ // similar to 'circle :radius'
			'instructionsDTO': [
				{'name': 'read-variable', 'variableName': 'radius'},
				{'name': 'call-cmd', 'commandName': 'circle', 'numArgs': 1, 'skipValidationAndSanitization': false}
			],
			'namedFunctionsMapSize': 1
		}
	];
	const compileOptions = {
		'translateToJavaScript': true,
		'forProduction': false
	};
	const info = {
		'isForProcedure': false,
		'parameters': []
	};
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instructions = instructionsDTOToInstructions(caseInfo.instructionsDTO);
		const result = instructionToJavaScriptInstruction(instructions, instructions.length - 1, info, compileOptions);
		if (!(result instanceof JavaScriptInstruction))
			plogger(`Expected a JavaScriptInstruction but got ${result}`);
		else if (caseInfo.namedFunctionsMapSize !== undefined && caseInfo.namedFunctionsMapSize !== result.extraNamedFunctionsMap.size)
			plogger(`Expected extraNamedFunctionsMap.size to be ${caseInfo.namedFunctionsMapSize} but got ${result.extraNamedFunctionsMap.size}`);
	});
};